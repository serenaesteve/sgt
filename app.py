import json
import re
import secrets
from functools import wraps

import requests
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_wtf.csrf import CSRFError
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config
from extensions import db, csrf, limiter
from models import User, CarBuild
from car_data import (
    CAR_DATA, COLORS, WHEELS, CALIPERS, INTERIORS, EXTRAS,
    CHALLENGES, ALLOWED_BETS,
    calculate_total_price, calculate_scores,
)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

_LEGACY_COLUMNS = [
    ('car_build', 'wheel_id',    "TEXT DEFAULT 'serie'"),
    ('car_build', 'interior_id', "TEXT DEFAULT 'nappa_negro'"),
    ('car_build', 'caliper_id',  "TEXT DEFAULT 'red'"),
    ('user',      'claimed_challenges', "TEXT DEFAULT '[]'"),
]


def _migrate_legacy_columns(app):
    """Añade columnas nuevas a instalaciones con una DB creada por versiones anteriores."""
    from sqlalchemy import text
    for table, col, col_def in _LEGACY_COLUMNS:
        try:
            with db.engine.connect() as conn:
                conn.execute(text(f'ALTER TABLE {table} ADD COLUMN {col} {col_def}'))
                conn.commit()
        except Exception:
            pass


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    csrf.init_app(app)
    limiter.init_app(app)

    with app.app_context():
        db.create_all()
        _migrate_legacy_columns(app)

    register_routes(app)

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        if request.path.startswith('/api/'):
            return jsonify({'success': False, 'error': 'Sesión expirada, recarga la página'}), 400
        return redirect(url_for('login'))

    return app


# ─── HELPERS ────────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        user = db.session.get(User, session['user_id'])
        if user is None:
            session.clear()
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


def current_user():
    return db.session.get(User, session['user_id'])


def catalog_names():
    return (
        {w['id']: w['name'] for w in WHEELS},
        {i['id']: i['name'] for i in INTERIORS},
        {c['id']: c['name'] for c in CALIPERS},
        {c['id']: c['hex'] for c in CALIPERS},
    )


def register_routes(app):
    # ─── RUTAS AUTH ─────────────────────────────────────────
    @app.route('/')
    def index():
        if 'user_id' in session:
            return redirect(url_for('garage'))
        return redirect(url_for('login'))

    @app.route('/login', methods=['GET', 'POST'])
    @limiter.limit('10 per minute')
    def login():
        error = None
        if request.method == 'POST':
            username = request.form.get('username', '').strip()
            password = request.form.get('password', '')
            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password_hash, password):
                session.clear()
                session['user_id'] = user.id
                session['username'] = user.username
                return redirect(url_for('garage'))
            error = 'Usuario o contraseña incorrectos'
        return render_template('login.html', error=error)

    @app.route('/register', methods=['GET', 'POST'])
    @limiter.limit('10 per minute')
    def register():
        error = None
        if request.method == 'POST':
            username = request.form.get('username', '').strip()
            email    = request.form.get('email', '').strip()
            password = request.form.get('password', '')

            if len(username) < 3 or len(username) > 30:
                error = 'El usuario debe tener entre 3 y 30 caracteres'
            elif not EMAIL_RE.match(email):
                error = 'Introduce un email válido'
            elif len(password) < 8:
                error = 'La contraseña debe tener al menos 8 caracteres'
            elif User.query.filter_by(username=username).first():
                error = 'El usuario ya existe'
            elif User.query.filter_by(email=email).first():
                error = 'El email ya está registrado'
            else:
                user = User(
                    username=username,
                    email=email,
                    password_hash=generate_password_hash(password),
                    budget=5000000.0
                )
                db.session.add(user)
                try:
                    db.session.commit()
                except Exception:
                    db.session.rollback()
                    error = 'El usuario o email ya está registrado'
                else:
                    session.clear()
                    session['user_id'] = user.id
                    session['username'] = user.username
                    return redirect(url_for('garage'))
        return render_template('register.html', error=error)

    @app.route('/logout')
    def logout():
        session.clear()
        return redirect(url_for('login'))

    # ─── RUTAS PRINCIPALES ──────────────────────────────────
    @app.route('/garage')
    @login_required
    def garage():
        user = current_user()
        builds = CarBuild.query.filter_by(user_id=user.id).order_by(CarBuild.created_at.desc()).all()
        wheel_names, interior_names, caliper_names, caliper_hexes = catalog_names()
        builds_data = [b.to_dict(wheel_names, interior_names, caliper_names, caliper_hexes) for b in builds]
        claimed = user.claimed_ids()
        challenges_data = [
            {'id': cid, 'name': c['name'], 'desc': c['desc'], 'reward': c['reward'],
             'claimed': cid in claimed, 'can_claim': cid not in claimed and c['check'](builds_data)}
            for cid, c in CHALLENGES.items()
        ]
        return render_template('garage.html', user=user, builds=builds_data, challenges=challenges_data)

    @app.route('/builder')
    @login_required
    def builder():
        user = current_user()
        return render_template('builder.html',
            user=user,
            car_data=CAR_DATA,
            colors=COLORS,
            wheels=WHEELS,
            calipers=CALIPERS,
            interiors=INTERIORS,
            extras=EXTRAS
        )

    @app.route('/race-game')
    @login_required
    def race_game():
        user = current_user()
        return render_template('race_game.html', user=user)

    @app.route('/api/car-data')
    @login_required
    def api_car_data():
        return jsonify(CAR_DATA)

    @app.route('/api/save-build', methods=['POST'])
    @login_required
    def save_build():
        data = request.get_json(silent=True) or {}
        user = current_user()

        brand       = data.get('brand')
        model       = data.get('model')
        engine      = data.get('engine')
        color       = data.get('color')
        color_hex   = data.get('color_hex', '#000000')
        wheel_id    = data.get('wheel_id', 'serie')
        interior_id = data.get('interior_id', 'nappa_negro')
        caliper_id  = data.get('caliper_id', 'red')
        extras_ids  = data.get('extras', [])
        build_name  = (data.get('name') or f'{brand} {model}').strip()[:100]

        if not isinstance(extras_ids, list):
            return jsonify({'success': False, 'error': 'Extras inválidos'}), 400

        total_price = calculate_total_price(
            brand, model, engine, color, wheel_id, interior_id, caliper_id, extras_ids
        )
        if total_price is None:
            return jsonify({'success': False, 'error': 'Configuración inválida'}), 400

        if total_price > user.budget:
            return jsonify({'success': False, 'error': 'Presupuesto insuficiente'}), 400

        speed, aesthetic, resale = calculate_scores(
            brand, model, engine, color, extras_ids,
            wheel_id, interior_id, caliper_id
        )

        build = CarBuild(
            user_id=user.id,
            name=build_name,
            brand=brand,
            model=model,
            engine=engine,
            color=color,
            color_hex=color_hex,
            wheel_id=wheel_id,
            interior_id=interior_id,
            caliper_id=caliper_id,
            extras=json.dumps(extras_ids),
            total_price=total_price,
            score_speed=speed,
            score_aesthetic=aesthetic,
            score_resale=resale
        )
        user.budget -= total_price
        db.session.add(build)
        db.session.commit()
        return jsonify({'success': True, 'build_id': build.id,
                        'speed': speed, 'aesthetic': aesthetic, 'resale': resale,
                        'total_price': total_price, 'new_budget': user.budget})

    @app.route('/api/delete-build/<int:build_id>', methods=['DELETE'])
    @login_required
    def delete_build(build_id):
        build = CarBuild.query.filter_by(id=build_id, user_id=session['user_id']).first()
        if build:
            db.session.delete(build)
            db.session.commit()
            return jsonify({'success': True})
        return jsonify({'success': False}), 404

    @app.route('/api/claim-challenge', methods=['POST'])
    @login_required
    def claim_challenge():
        data = request.get_json(silent=True) or {}
        challenge_id = data.get('challenge_id')
        challenge = CHALLENGES.get(challenge_id)
        if not challenge:
            return jsonify({'success': False, 'error': 'Desafío desconocido'}), 400

        user = current_user()
        claimed = user.claimed_ids()
        if challenge_id in claimed:
            return jsonify({'success': False, 'error': 'Ya reclamado'}), 400

        wheel_names, interior_names, caliper_names, caliper_hexes = catalog_names()
        builds_data = [
            b.to_dict(wheel_names, interior_names, caliper_names, caliper_hexes)
            for b in CarBuild.query.filter_by(user_id=user.id).all()
        ]
        if not challenge['check'](builds_data):
            return jsonify({'success': False, 'error': 'Condición no cumplida'}), 400

        claimed.append(challenge_id)
        user.claimed_challenges = json.dumps(claimed)
        user.budget += challenge['reward']
        db.session.commit()
        return jsonify({'success': True, 'new_budget': user.budget, 'reward': challenge['reward']})

    @app.route('/api/race/start', methods=['POST'])
    @login_required
    def race_start():
        data = request.get_json(silent=True) or {}
        bet = data.get('bet', 0)
        user = current_user()

        if not isinstance(bet, (int, float)) or bet not in ALLOWED_BETS:
            return jsonify({'success': False, 'error': 'Apuesta inválida'}), 400
        if bet > user.budget:
            return jsonify({'success': False, 'error': 'Presupuesto insuficiente'}), 400

        race_token = secrets.token_hex(16)
        user.budget -= bet
        session['pending_race'] = {'token': race_token, 'bet': bet}
        db.session.commit()
        return jsonify({'success': True, 'race_token': race_token, 'new_budget': user.budget})

    @app.route('/api/race/result', methods=['POST'])
    @login_required
    def race_result():
        data = request.get_json(silent=True) or {}
        race_token = data.get('race_token')
        won = bool(data.get('won'))

        pending = session.get('pending_race')
        if not pending or pending.get('token') != race_token:
            return jsonify({'success': False, 'error': 'Carrera no reconocida'}), 400

        session.pop('pending_race', None)
        user = current_user()
        bet = pending['bet']
        if won and bet > 0:
            user.budget += bet * 2
            db.session.commit()

        return jsonify({'success': True, 'new_budget': user.budget, 'payout': bet * 2 if won else 0})

    @app.route('/api/ai-advice', methods=['POST'])
    @login_required
    def ai_advice():
        data        = request.get_json(silent=True) or {}
        brand       = data.get('brand', '')
        model       = data.get('model', '')
        engine      = data.get('engine', '')
        color       = data.get('color', '')
        wheel_id    = data.get('wheel_id', 'serie')
        interior_id = data.get('interior_id', 'nappa_negro')
        extras      = data.get('extras', [])
        budget_left = data.get('budget_left', 0)
        total_price = data.get('total_price', 0)

        wheel_name    = next((w['name'] for w in WHEELS    if w['id'] == wheel_id),    'Serie')
        interior_name = next((i['name'] for i in INTERIORS if i['id'] == interior_id), 'Nappa Negro')
        extras_names  = [e['name'] for e in EXTRAS if e['id'] in extras]

        prompt = f"""Eres un experto consultor en supercars y coches deportivos de lujo de talla mundial.
El cliente está configurando su coche ideal y necesita tu consejo experto.

Configuración actual:
- Marca: {brand} ({CAR_DATA.get(brand, {}).get('country', '')})
- Modelo: {model}
- Motor: {engine}
- Color: {color}
- Llantas: {wheel_name}
- Interior: {interior_name}
- Extras: {', '.join(extras_names) if extras_names else 'Ninguno'}
- Precio total configurado: €{total_price:,.0f}
- Presupuesto restante: €{budget_left:,.0f}

Da un consejo de máximo 3 frases sobre:
1. Valoración de la configuración actual y qué cambiarías
2. El extra o upgrade más interesante con el presupuesto restante
3. El valor de reventa y exclusividad de esta configuración

Responde en español, con tono apasionado y experto. Sé directo y concreto."""

        try:
            response = requests.post(
                'http://localhost:11434/api/generate',
                json={'model': 'llama3', 'prompt': prompt, 'stream': False},
                timeout=30
            )
            if response.status_code == 200:
                result = response.json()
                advice = result.get('response', 'No se pudo obtener consejo.')
            else:
                advice = 'El servicio de IA no está disponible.'
        except Exception:
            advice = 'Conecta Ollama para recibir consejo experto: ollama serve'

        return jsonify({'advice': advice})


if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG, port=5000)
