from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'supercar_secret_key_2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///supercar.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ─── MODELOS ────────────────────────────────────────────────
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    budget = db.Column(db.Float, default=500000.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    builds = db.relationship('CarBuild', backref='user', lazy=True)

class CarBuild(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    engine = db.Column(db.String(100))
    color = db.Column(db.String(50))
    color_hex = db.Column(db.String(10))
    extras = db.Column(db.Text, default='[]')
    total_price = db.Column(db.Float, default=0)
    score_speed = db.Column(db.Integer, default=0)
    score_aesthetic = db.Column(db.Integer, default=0)
    score_resale = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ─── DATOS DE COCHES ────────────────────────────────────────
CAR_DATA = {
    "Ferrari": {
        "base_price": 220000,
        "models": {
            "F8 Tributo": {"price": 0, "speed_bonus": 18, "aesthetic_bonus": 20, "resale_bonus": 15},
            "SF90 Stradale": {"price": 180000, "speed_bonus": 25, "aesthetic_bonus": 22, "resale_bonus": 18},
            "Roma": {"price": 40000, "speed_bonus": 15, "aesthetic_bonus": 24, "resale_bonus": 16},
            "812 Superfast": {"price": 120000, "speed_bonus": 22, "aesthetic_bonus": 21, "resale_bonus": 14},
        },
        "engines": {
            "3.9L V8 BiTurbo 720CV": {"price": 0, "speed_bonus": 20, "resale_bonus": 8},
            "4.0L V8 BiTurbo 1000CV Híbrido": {"price": 85000, "speed_bonus": 30, "resale_bonus": 12},
            "6.5L V12 NA 800CV": {"price": 60000, "speed_bonus": 26, "resale_bonus": 15},
        }
    },
    "Lamborghini": {
        "base_price": 200000,
        "models": {
            "Huracán EVO": {"price": 0, "speed_bonus": 20, "aesthetic_bonus": 22, "resale_bonus": 14},
            "Urus Performante": {"price": 50000, "speed_bonus": 16, "aesthetic_bonus": 18, "resale_bonus": 20},
            "Revuelto": {"price": 250000, "speed_bonus": 28, "aesthetic_bonus": 26, "resale_bonus": 22},
            "Huracán STO": {"price": 100000, "speed_bonus": 24, "aesthetic_bonus": 25, "resale_bonus": 16},
        },
        "engines": {
            "5.2L V10 NA 640CV": {"price": 0, "speed_bonus": 20, "resale_bonus": 10},
            "6.5L V12 NA 814CV": {"price": 90000, "speed_bonus": 28, "resale_bonus": 14},
            "4.0L V8 BiTurbo + Eléctrico 1001CV": {"price": 120000, "speed_bonus": 32, "resale_bonus": 16},
        }
    },
    "Porsche": {
        "base_price": 120000,
        "models": {
            "911 Carrera S": {"price": 0, "speed_bonus": 16, "aesthetic_bonus": 20, "resale_bonus": 20},
            "911 GT3 RS": {"price": 80000, "speed_bonus": 24, "aesthetic_bonus": 22, "resale_bonus": 22},
            "Taycan Turbo S": {"price": 60000, "speed_bonus": 22, "aesthetic_bonus": 18, "resale_bonus": 18},
            "Cayman GT4": {"price": 30000, "speed_bonus": 20, "aesthetic_bonus": 19, "resale_bonus": 21},
        },
        "engines": {
            "3.0L Flat-6 BiTurbo 450CV": {"price": 0, "speed_bonus": 16, "resale_bonus": 12},
            "4.0L Flat-6 NA 525CV": {"price": 45000, "speed_bonus": 22, "resale_bonus": 15},
            "Motor Eléctrico 761CV": {"price": 35000, "speed_bonus": 20, "resale_bonus": 14},
        }
    },
    "McLaren": {
        "base_price": 180000,
        "models": {
            "720S": {"price": 0, "speed_bonus": 22, "aesthetic_bonus": 21, "resale_bonus": 15},
            "Artura": {"price": 20000, "speed_bonus": 20, "aesthetic_bonus": 20, "resale_bonus": 16},
            "765LT": {"price": 100000, "speed_bonus": 26, "aesthetic_bonus": 23, "resale_bonus": 17},
            "Senna": {"price": 400000, "speed_bonus": 32, "aesthetic_bonus": 28, "resale_bonus": 20},
        },
        "engines": {
            "4.0L V8 BiTurbo 720CV": {"price": 0, "speed_bonus": 22, "resale_bonus": 10},
            "4.0L V8 BiTurbo + Eléctrico 671CV": {"price": 40000, "speed_bonus": 20, "resale_bonus": 13},
            "4.0L V8 BiTurbo 765CV": {"price": 70000, "speed_bonus": 26, "resale_bonus": 14},
        }
    },
    "Bugatti": {
        "base_price": 2500000,
        "models": {
            "Chiron": {"price": 0, "speed_bonus": 35, "aesthetic_bonus": 28, "resale_bonus": 25},
            "Chiron Super Sport": {"price": 1000000, "speed_bonus": 40, "aesthetic_bonus": 30, "resale_bonus": 28},
            "Tourbillon": {"price": 2000000, "speed_bonus": 45, "aesthetic_bonus": 35, "resale_bonus": 32},
        },
        "engines": {
            "8.0L W16 QuadTurbo 1500CV": {"price": 0, "speed_bonus": 38, "resale_bonus": 20},
            "8.0L W16 QuadTurbo 1600CV": {"price": 500000, "speed_bonus": 42, "resale_bonus": 22},
        }
    }
}

COLORS = [
    {"name": "Rosso Corsa", "hex": "#C41230", "price": 0, "aesthetic_bonus": 5},
    {"name": "Nero Daytona", "hex": "#1A1A1A", "price": 0, "aesthetic_bonus": 4},
    {"name": "Bianco Avus", "hex": "#F5F5F0", "price": 0, "aesthetic_bonus": 4},
    {"name": "Blu Pozzi", "hex": "#1B3A6B", "price": 8000, "aesthetic_bonus": 6},
    {"name": "Verde Mantis", "hex": "#4A7C59", "price": 8000, "aesthetic_bonus": 6},
    {"name": "Giallo Modena", "hex": "#F5C400", "price": 8000, "aesthetic_bonus": 7},
    {"name": "Arancio Atlas", "hex": "#E8610A", "price": 8000, "aesthetic_bonus": 6},
    {"name": "Oro Brillante", "hex": "#C9A84C", "price": 25000, "aesthetic_bonus": 9},
    {"name": "Carbon Satin", "hex": "#2D2D2D", "price": 35000, "aesthetic_bonus": 10},
    {"name": "Viola Parsifae", "hex": "#6B2D8B", "price": 15000, "aesthetic_bonus": 8},
]

EXTRAS = [
    {"id": "carbon_pack", "name": "Carbon Fiber Pack", "price": 28000, "speed_bonus": 3, "aesthetic_bonus": 8, "resale_bonus": 5},
    {"id": "sport_exhaust", "name": "Escape Deportivo Titanio", "price": 12000, "speed_bonus": 2, "aesthetic_bonus": 4, "resale_bonus": 2},
    {"id": "racing_seats", "name": "Asientos Racing Alcántara", "price": 18000, "speed_bonus": 1, "aesthetic_bonus": 6, "resale_bonus": 3},
    {"id": "aero_kit", "name": "Aero Kit Activo", "price": 35000, "speed_bonus": 5, "aesthetic_bonus": 7, "resale_bonus": 4},
    {"id": "ceramic_brakes", "name": "Frenos Cerámicos PCCB", "price": 22000, "speed_bonus": 4, "aesthetic_bonus": 3, "resale_bonus": 4},
    {"id": "forged_wheels", "name": "Llantas Forjadas 21\"", "price": 16000, "speed_bonus": 2, "aesthetic_bonus": 7, "resale_bonus": 3},
    {"id": "roll_cage", "name": "Jaula de Seguridad", "price": 8000, "speed_bonus": 2, "aesthetic_bonus": 2, "resale_bonus": 1},
    {"id": "launch_control", "name": "Launch Control System", "price": 5000, "speed_bonus": 3, "aesthetic_bonus": 1, "resale_bonus": 2},
    {"id": "head_up", "name": "Head-Up Display", "price": 4500, "speed_bonus": 0, "aesthetic_bonus": 3, "resale_bonus": 2},
    {"id": "panoramic", "name": "Techo Panorámico Electrocrómico", "price": 9000, "speed_bonus": 0, "aesthetic_bonus": 5, "resale_bonus": 3},
]

# ─── HELPERS ────────────────────────────────────────────────
def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

def calculate_scores(brand, model, engine, color_name, extras_ids):
    speed = 50
    aesthetic = 50
    resale = 50

    if brand in CAR_DATA:
        bd = CAR_DATA[brand]
        if model in bd["models"]:
            m = bd["models"][model]
            speed += m.get("speed_bonus", 0)
            aesthetic += m.get("aesthetic_bonus", 0)
            resale += m.get("resale_bonus", 0)
        if engine in bd["engines"]:
            e = bd["engines"][engine]
            speed += e.get("speed_bonus", 0)
            resale += e.get("resale_bonus", 0)

    for c in COLORS:
        if c["name"] == color_name:
            aesthetic += c.get("aesthetic_bonus", 0)
            break

    for ex in EXTRAS:
        if ex["id"] in extras_ids:
            speed += ex.get("speed_bonus", 0)
            aesthetic += ex.get("aesthetic_bonus", 0)
            resale += ex.get("resale_bonus", 0)

    return min(speed, 100), min(aesthetic, 100), min(resale, 100)

# ─── RUTAS AUTH ─────────────────────────────────────────────
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('garage'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('garage'))
        error = 'Usuario o contraseña incorrectos'
    return render_template('login.html', error=error)

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        if User.query.filter_by(username=username).first():
            error = 'El usuario ya existe'
        elif User.query.filter_by(email=email).first():
            error = 'El email ya está registrado'
        else:
            user = User(
                username=username,
                email=email,
                password_hash=generate_password_hash(password),
                budget=500000.0
            )
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('garage'))
    return render_template('register.html', error=error)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ─── RUTAS PRINCIPALES ──────────────────────────────────────
@app.route('/garage')
@login_required
def garage():
    user = User.query.get(session['user_id'])
    builds = CarBuild.query.filter_by(user_id=user.id).order_by(CarBuild.created_at.desc()).all()
    builds_data = []
    for b in builds:
        extras_list = json.loads(b.extras) if b.extras else []
        builds_data.append({
            'id': b.id,
            'name': b.name,
            'brand': b.brand,
            'model': b.model,
            'engine': b.engine,
            'color': b.color,
            'color_hex': b.color_hex,
            'extras': extras_list,
            'total_price': b.total_price,
            'score_speed': b.score_speed,
            'score_aesthetic': b.score_aesthetic,
            'score_resale': b.score_resale,
            'created_at': b.created_at.strftime('%d/%m/%Y')
        })
    return render_template('garage.html', user=user, builds=builds_data)

@app.route('/builder')
@login_required
def builder():
    user = User.query.get(session['user_id'])
    return render_template('builder.html', user=user, car_data=CAR_DATA, colors=COLORS, extras=EXTRAS)

@app.route('/api/car-data')
@login_required
def api_car_data():
    return jsonify(CAR_DATA)

@app.route('/api/save-build', methods=['POST'])
@login_required
def save_build():
    data = request.json
    user = User.query.get(session['user_id'])

    brand = data.get('brand')
    model = data.get('model')
    engine = data.get('engine')
    color = data.get('color')
    color_hex = data.get('color_hex', '#000000')
    extras_ids = data.get('extras', [])
    total_price = data.get('total_price', 0)
    build_name = data.get('name', f'Mi {brand} {model}')

    speed, aesthetic, resale = calculate_scores(brand, model, engine, color, extras_ids)

    build = CarBuild(
        user_id=user.id,
        name=build_name,
        brand=brand,
        model=model,
        engine=engine,
        color=color,
        color_hex=color_hex,
        extras=json.dumps(extras_ids),
        total_price=total_price,
        score_speed=speed,
        score_aesthetic=aesthetic,
        score_resale=resale
    )
    db.session.add(build)
    db.session.commit()
    return jsonify({'success': True, 'build_id': build.id, 'speed': speed, 'aesthetic': aesthetic, 'resale': resale})

@app.route('/api/delete-build/<int:build_id>', methods=['DELETE'])
@login_required
def delete_build(build_id):
    build = CarBuild.query.filter_by(id=build_id, user_id=session['user_id']).first()
    if build:
        db.session.delete(build)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

@app.route('/api/ai-advice', methods=['POST'])
@login_required
def ai_advice():
    data = request.json
    brand = data.get('brand', '')
    model = data.get('model', '')
    engine = data.get('engine', '')
    color = data.get('color', '')
    extras = data.get('extras', [])
    budget_left = data.get('budget_left', 0)
    total_price = data.get('total_price', 0)

    extras_names = [e['name'] for e in EXTRAS if e['id'] in extras]

    prompt = f"""Eres un experto en supercars y coches deportivos de lujo. El usuario está configurando su coche y necesita consejo.

Configuración actual:
- Marca: {brand}
- Modelo: {model}
- Motor: {engine}
- Color: {color}
- Extras seleccionados: {', '.join(extras_names) if extras_names else 'Ninguno'}
- Precio total hasta ahora: {total_price:,.0f}€
- Presupuesto restante: {budget_left:,.0f}€

Da un consejo breve y experto (máximo 3 frases) sobre:
1. Si la configuración actual es buena o qué cambiarías
2. Qué extra añadirías con el presupuesto restante si lo hay
3. El valor de reventa de esta configuración

Responde en español, con tono de experto apasionado por los supercars. Sé directo y concreto."""

    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={'model': 'llama3', 'prompt': prompt, 'stream': False},
            timeout=30
        )
        if response.status_code == 200:
            result = response.json()
            advice = result.get('response', 'No se pudo obtener consejo en este momento.')
        else:
            advice = 'El servicio de IA no está disponible. Asegúrate de que Ollama está ejecutándose.'
    except Exception as e:
        advice = f'No se pudo conectar con Ollama. Verifica que está activo con: ollama serve'

    return jsonify({'advice': advice})

@app.route('/api/update-budget', methods=['POST'])
@login_required
def update_budget():
    data = request.json
    amount = data.get('amount', 0)
    user = User.query.get(session['user_id'])
    user.budget += amount
    db.session.commit()
    return jsonify({'success': True, 'new_budget': user.budget})

# ─── INIT ────────────────────────────────────────────────────
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
