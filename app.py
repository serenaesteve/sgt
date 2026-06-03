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
    budget = db.Column(db.Float, default=5000000.0)
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
    wheel_id = db.Column(db.String(50), default='serie')
    interior_id = db.Column(db.String(50), default='nappa_negro')
    caliper_id = db.Column(db.String(50), default='red')
    extras = db.Column(db.Text, default='[]')
    total_price = db.Column(db.Float, default=0)
    score_speed = db.Column(db.Integer, default=0)
    score_aesthetic = db.Column(db.Integer, default=0)
    score_resale = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ─── DATOS DE COCHES ────────────────────────────────────────
CAR_DATA = {
    "Ferrari": {
        "base_price": 240000,
        "country": "Italia",
        "accent": "#C41230",
        "models": {
            "296 GTB":       {"price": 0,       "speed_bonus": 18, "aesthetic_bonus": 22, "resale_bonus": 16},
            "Roma":          {"price": 40000,    "speed_bonus": 15, "aesthetic_bonus": 26, "resale_bonus": 17},
            "12 Cilindri":   {"price": 180000,   "speed_bonus": 22, "aesthetic_bonus": 28, "resale_bonus": 19},
            "SF90 Stradale": {"price": 280000,   "speed_bonus": 26, "aesthetic_bonus": 24, "resale_bonus": 20},
            "F80":           {"price": 3200000,  "speed_bonus": 38, "aesthetic_bonus": 35, "resale_bonus": 30},
        },
        "engines": {
            "3.0L V6 Turbo Ibrido 830CV":    {"price": 0,     "speed_bonus": 18, "resale_bonus": 10},
            "3.9L V8 BiTurbo 620CV":         {"price": 0,     "speed_bonus": 15, "resale_bonus": 8},
            "6.5L V12 NA 830CV":             {"price": 60000, "speed_bonus": 22, "resale_bonus": 15},
            "4.0L V8 Ibrido 1000CV":         {"price": 85000, "speed_bonus": 28, "resale_bonus": 14},
        }
    },
    "Lamborghini": {
        "base_price": 220000,
        "country": "Italia",
        "accent": "#E8610A",
        "models": {
            "Huracán Sterrato": {"price": 0,      "speed_bonus": 18, "aesthetic_bonus": 22, "resale_bonus": 15},
            "Huracán STO":      {"price": 60000,  "speed_bonus": 24, "aesthetic_bonus": 25, "resale_bonus": 17},
            "Temerario":        {"price": 220000, "speed_bonus": 26, "aesthetic_bonus": 26, "resale_bonus": 20},
            "Revuelto":         {"price": 380000, "speed_bonus": 30, "aesthetic_bonus": 28, "resale_bonus": 22},
        },
        "engines": {
            "5.2L V10 NA 640CV":              {"price": 0,     "speed_bonus": 20, "resale_bonus": 12},
            "4.0L V8 BiTurbo 800CV":          {"price": 45000, "speed_bonus": 24, "resale_bonus": 13},
            "6.5L V12 NA + Eléctrico 1015CV": {"price": 90000, "speed_bonus": 30, "resale_bonus": 16},
        }
    },
    "Porsche": {
        "base_price": 135000,
        "country": "Alemania",
        "accent": "#C9A84C",
        "models": {
            "911 Carrera GTS":    {"price": 0,      "speed_bonus": 16, "aesthetic_bonus": 20, "resale_bonus": 22},
            "Cayman GT4 RS":      {"price": 50000,  "speed_bonus": 20, "aesthetic_bonus": 21, "resale_bonus": 22},
            "911 GT3":            {"price": 100000, "speed_bonus": 24, "aesthetic_bonus": 22, "resale_bonus": 24},
            "911 GT3 RS":         {"price": 150000, "speed_bonus": 26, "aesthetic_bonus": 23, "resale_bonus": 24},
            "Panamera Turbo S":   {"price": 220000, "speed_bonus": 20, "aesthetic_bonus": 25, "resale_bonus": 24},
        },
        "engines": {
            "3.0L Flat-6 BiTurbo 480CV":   {"price": 0,     "speed_bonus": 16, "resale_bonus": 14},
            "3.0L Flat-6 BiTurbo 541CV":   {"price": 20000, "speed_bonus": 18, "resale_bonus": 15},
            "4.0L Flat-6 NA 525CV":        {"price": 45000, "speed_bonus": 22, "resale_bonus": 16},
            "4.0L V8 BiTurbo 630CV Turbo S":{"price": 60000, "speed_bonus": 20, "resale_bonus": 16},
        }
    },
    "McLaren": {
        "base_price": 220000,
        "country": "Gran Bretaña",
        "accent": "#FF8C00",
        "models": {
            "Artura":  {"price": 0,       "speed_bonus": 19, "aesthetic_bonus": 21, "resale_bonus": 16},
            "GTS":     {"price": 60000,   "speed_bonus": 20, "aesthetic_bonus": 22, "resale_bonus": 17},
            "750S":    {"price": 120000,  "speed_bonus": 25, "aesthetic_bonus": 23, "resale_bonus": 18},
            "W1":      {"price": 1800000, "speed_bonus": 38, "aesthetic_bonus": 34, "resale_bonus": 28},
        },
        "engines": {
            "3.8L V8 BiTurbo 620CV":              {"price": 0,      "speed_bonus": 19, "resale_bonus": 10},
            "4.0L V8 BiTurbo 750CV":              {"price": 40000,  "speed_bonus": 24, "resale_bonus": 13},
            "4.0L V8 BiTurbo + Eléctrico 1275CV": {"price": 120000, "speed_bonus": 32, "resale_bonus": 18},
        }
    },
    "Aston Martin": {
        "base_price": 165000,
        "country": "Gran Bretaña",
        "accent": "#1B4D2E",
        "models": {
            "DB12":     {"price": 0,      "speed_bonus": 15, "aesthetic_bonus": 24, "resale_bonus": 18},
            "Vantage":  {"price": 50000,  "speed_bonus": 18, "aesthetic_bonus": 22, "resale_bonus": 18},
            "Vanquish": {"price": 180000, "speed_bonus": 20, "aesthetic_bonus": 26, "resale_bonus": 20},
            "Valhalla": {"price": 600000, "speed_bonus": 32, "aesthetic_bonus": 30, "resale_bonus": 25},
        },
        "engines": {
            "4.0L V8 BiTurbo 665CV":    {"price": 0,      "speed_bonus": 15, "resale_bonus": 12},
            "4.0L V8 BiTurbo 680CV":    {"price": 25000,  "speed_bonus": 17, "resale_bonus": 13},
            "5.2L V12 BiTurbo 835CV":   {"price": 65000,  "speed_bonus": 22, "resale_bonus": 16},
            "AMR23 Híbrido 1000CV":     {"price": 180000, "speed_bonus": 30, "resale_bonus": 22},
        }
    },
    "Bugatti": {
        "base_price": 3200000,
        "country": "Francia",
        "accent": "#1B3A6B",
        "models": {
            "Chiron Super Sport": {"price": 0,       "speed_bonus": 38, "aesthetic_bonus": 30, "resale_bonus": 28},
            "Tourbillon":         {"price": 2500000, "speed_bonus": 45, "aesthetic_bonus": 38, "resale_bonus": 35},
        },
        "engines": {
            "8.0L W16 QuadTurbo 1578CV": {"price": 0,      "speed_bonus": 38, "resale_bonus": 22},
            "V16 NA + Eléctrico 1800CV": {"price": 500000, "speed_bonus": 45, "resale_bonus": 28},
        }
    },
    "Maserati": {
        "base_price": 220000,
        "country": "Italia",
        "accent": "#1B3A6B",
        "models": {
            "MC20":               {"price": 0,      "speed_bonus": 20, "aesthetic_bonus": 24, "resale_bonus": 16},
            "MC20 Cielo":         {"price": 65000,  "speed_bonus": 19, "aesthetic_bonus": 26, "resale_bonus": 17},
            "GranTurismo Folgore":{"price": 80000,  "speed_bonus": 22, "aesthetic_bonus": 26, "resale_bonus": 18},
            "GranCabrio Folgore": {"price": 100000, "speed_bonus": 20, "aesthetic_bonus": 28, "resale_bonus": 19},
        },
        "engines": {
            "3.0L V6 Nettuno BiTurbo 630CV": {"price": 0,     "speed_bonus": 20, "resale_bonus": 12},
            "Motor Eléctrico 761CV":          {"price": 30000, "speed_bonus": 22, "resale_bonus": 13},
        }
    },
    "Ford": {
        "base_price": 55000,
        "country": "USA",
        "accent": "#003087",
        "models": {
            "Mustang GT":        {"price": 0,     "speed_bonus": 13, "aesthetic_bonus": 18, "resale_bonus": 12},
            "Mustang Mach 1":    {"price": 12000, "speed_bonus": 15, "aesthetic_bonus": 20, "resale_bonus": 13},
            "Mustang Dark Horse":{"price": 22000, "speed_bonus": 17, "aesthetic_bonus": 22, "resale_bonus": 14},
            "Shelby GT500":      {"price": 38000, "speed_bonus": 22, "aesthetic_bonus": 24, "resale_bonus": 16},
        },
        "engines": {
            "2.3L EcoBoost 315CV":         {"price": 0,      "speed_bonus": 11, "resale_bonus": 8},
            "5.0L V8 Coyote 450CV":        {"price": 8000,   "speed_bonus": 15, "resale_bonus": 11},
            "5.2L V8 Predator SC 760CV":   {"price": 25000,  "speed_bonus": 22, "resale_bonus": 14},
        }
    },
    "Nissan": {
        "base_price": 113000,
        "country": "Japón",
        "accent": "#C8102E",
        "models": {
            "GT-R Premium":        {"price": 0,     "speed_bonus": 18, "aesthetic_bonus": 19, "resale_bonus": 16},
            "GT-R Track Edition":  {"price": 20000, "speed_bonus": 20, "aesthetic_bonus": 20, "resale_bonus": 17},
            "GT-R NISMO":          {"price": 60000, "speed_bonus": 24, "aesthetic_bonus": 22, "resale_bonus": 19},
            "GT-R NISMO Special":  {"price": 95000, "speed_bonus": 26, "aesthetic_bonus": 24, "resale_bonus": 20},
        },
        "engines": {
            "3.8L V6 BiTurbo 570CV":        {"price": 0,     "speed_bonus": 18, "resale_bonus": 12},
            "3.8L V6 BiTurbo 600CV NISMO":  {"price": 20000, "speed_bonus": 20, "resale_bonus": 14},
            "3.8L V6 BiTurbo 650CV Special":{"price": 40000, "speed_bonus": 23, "resale_bonus": 16},
        }
    },
    "Audi": {
        "base_price": 165000,
        "country": "Alemania",
        "accent": "#BB0A30",
        "models": {
            "R8 V10":              {"price": 0,     "speed_bonus": 17, "aesthetic_bonus": 22, "resale_bonus": 17},
            "R8 Spyder":           {"price": 25000, "speed_bonus": 16, "aesthetic_bonus": 24, "resale_bonus": 18},
            "R8 V10 Performance":  {"price": 35000, "speed_bonus": 20, "aesthetic_bonus": 22, "resale_bonus": 18},
            "R8 V10 GT":           {"price": 80000, "speed_bonus": 23, "aesthetic_bonus": 24, "resale_bonus": 20},
        },
        "engines": {
            "5.2L V10 FSI 570CV":             {"price": 0,     "speed_bonus": 17, "resale_bonus": 13},
            "5.2L V10 FSI 620CV Performance": {"price": 18000, "speed_bonus": 20, "resale_bonus": 15},
            "5.2L V10 FSI 630CV GT":          {"price": 35000, "speed_bonus": 22, "resale_bonus": 17},
        }
    },
}

COLORS = [
    # Gloss
    {"name": "Rosso Corsa",        "hex": "#C41230", "finish": "Gloss",    "price": 0,     "aesthetic_bonus": 5},
    {"name": "Giallo Modena",      "hex": "#F5C400", "finish": "Gloss",    "price": 0,     "aesthetic_bonus": 5},
    {"name": "Nero Daytona",       "hex": "#0D0D0D", "finish": "Gloss",    "price": 0,     "aesthetic_bonus": 4},
    {"name": "Bianco Avus",        "hex": "#F0EEE8", "finish": "Gloss",    "price": 0,     "aesthetic_bonus": 4},
    # Metallic
    {"name": "Blu Tour de France", "hex": "#1B3A6B", "finish": "Metallic", "price": 9000,  "aesthetic_bonus": 7},
    {"name": "Grigio Silverstone", "hex": "#8D9093", "finish": "Metallic", "price": 9000,  "aesthetic_bonus": 6},
    {"name": "Verde British",      "hex": "#1B4D2E", "finish": "Metallic", "price": 9000,  "aesthetic_bonus": 7},
    {"name": "Rosso Portofino",    "hex": "#A0321F", "finish": "Metallic", "price": 12000, "aesthetic_bonus": 7},
    {"name": "Arancio Atlas",      "hex": "#D4600A", "finish": "Metallic", "price": 12000, "aesthetic_bonus": 7},
    {"name": "Oro Brillante",      "hex": "#C9A84C", "finish": "Metallic", "price": 25000, "aesthetic_bonus": 9},
    # Pearl
    {"name": "Verde Mantis",       "hex": "#2D6A4F", "finish": "Pearl",    "price": 15000, "aesthetic_bonus": 8},
    {"name": "Azzurro California", "hex": "#4FB3D4", "finish": "Pearl",    "price": 15000, "aesthetic_bonus": 8},
    {"name": "Bianco Fuji",        "hex": "#F7F5F0", "finish": "Pearl",    "price": 18000, "aesthetic_bonus": 9},
    {"name": "Viola Parsifae",     "hex": "#6B2D8B", "finish": "Pearl",    "price": 18000, "aesthetic_bonus": 9},
    # Matte
    {"name": "Grigio Nürburgring", "hex": "#4A4A4A", "finish": "Matte",    "price": 22000, "aesthetic_bonus": 9},
    {"name": "Nero Opaco",         "hex": "#181818", "finish": "Matte",    "price": 22000, "aesthetic_bonus": 9},
    {"name": "Verde Racing Matte", "hex": "#2A4A1E", "finish": "Matte",    "price": 25000, "aesthetic_bonus": 10},
    # Satin
    {"name": "Carbon Satin",       "hex": "#2D2D2D", "finish": "Satin",    "price": 35000, "aesthetic_bonus": 10},
    {"name": "Grigio Titanio",     "hex": "#6B7280", "finish": "Satin",    "price": 28000, "aesthetic_bonus": 9},
    {"name": "Blu Scuro Satin",    "hex": "#1A2A4A", "finish": "Satin",    "price": 30000, "aesthetic_bonus": 9},
]

WHEELS = [
    {"id": "serie",      "name": "Llantas de Serie",       "size": "19\"", "finish": "Estándar",        "price": 0,     "speed_bonus": 0, "aesthetic_bonus": 0},
    {"id": "sport_20",   "name": "Sport 5 Radios",         "size": "20\"", "finish": "Negro Pulido",    "price": 8500,  "speed_bonus": 1, "aesthetic_bonus": 4},
    {"id": "forged_21",  "name": "Forjadas Diseño Y",      "size": "21\"", "finish": "Plata Pulida",    "price": 16000, "speed_bonus": 2, "aesthetic_bonus": 6},
    {"id": "diamond_21", "name": "Diamond Cut 10 Radios",  "size": "21\"", "finish": "Corte Diamante",  "price": 22000, "speed_bonus": 2, "aesthetic_bonus": 7},
    {"id": "carbon_20",  "name": "Carbono Ultra-Ligeras",  "size": "20\"", "finish": "Fibra de Carbono","price": 42000, "speed_bonus": 4, "aesthetic_bonus": 10},
]

CALIPERS = [
    {"id": "red",    "name": "Rojo",     "hex": "#CC0000", "price": 0,    "aesthetic_bonus": 2},
    {"id": "yellow", "name": "Amarillo", "hex": "#F5C400", "price": 0,    "aesthetic_bonus": 2},
    {"id": "black",  "name": "Negro",    "hex": "#1A1A1A", "price": 0,    "aesthetic_bonus": 2},
    {"id": "silver", "name": "Plata",    "hex": "#BBBBBB", "price": 0,    "aesthetic_bonus": 1},
    {"id": "blue",   "name": "Azul",     "hex": "#1B3A8B", "price": 3500, "aesthetic_bonus": 3},
    {"id": "green",  "name": "Verde",    "hex": "#1B6B3A", "price": 3500, "aesthetic_bonus": 3},
    {"id": "gold",   "name": "Dorado",   "hex": "#C9A84C", "price": 5000, "aesthetic_bonus": 4},
    {"id": "carbon", "name": "Carbono",  "hex": "#2D2D2D", "price": 8500, "aesthetic_bonus": 5},
]

INTERIORS = [
    {"id": "nappa_negro",     "name": "Cuero Nappa Negro",    "swatch": "#1A1A1A", "price": 0,     "aesthetic_bonus": 4, "resale_bonus": 2},
    {"id": "nappa_rosso",     "name": "Cuero Nappa Rosso",    "swatch": "#8B1A1A", "price": 12000, "aesthetic_bonus": 6, "resale_bonus": 3},
    {"id": "nappa_beige",     "name": "Cuero Nappa Beige",    "swatch": "#D4B896", "price": 12000, "aesthetic_bonus": 6, "resale_bonus": 3},
    {"id": "bicolor",         "name": "Bi-Color Negro/Rojo",  "swatch": "#3D0A0A", "price": 18000, "aesthetic_bonus": 7, "resale_bonus": 3},
    {"id": "alcantara",       "name": "Alcántara Racing",     "swatch": "#2A2A2A", "price": 22000, "aesthetic_bonus": 8, "resale_bonus": 4},
    {"id": "ivory",           "name": "Cuero Premium Ivory",  "swatch": "#F0EAD6", "price": 15000, "aesthetic_bonus": 7, "resale_bonus": 3},
    {"id": "tan",             "name": "Tan Heritage Brown",   "swatch": "#8B6914", "price": 16000, "aesthetic_bonus": 7, "resale_bonus": 3},
]

EXTRAS = [
    {"id": "carbon_pack",   "name": "Pack Fibra de Carbono",     "price": 28000, "speed_bonus": 3, "aesthetic_bonus": 8,  "resale_bonus": 5},
    {"id": "aero_kit",      "name": "Aero Kit Activo",           "price": 35000, "speed_bonus": 5, "aesthetic_bonus": 7,  "resale_bonus": 4},
    {"id": "ceramic_brakes","name": "Frenos Cerámicos PCCB",     "price": 22000, "speed_bonus": 4, "aesthetic_bonus": 3,  "resale_bonus": 5},
    {"id": "sport_exhaust", "name": "Escape Deportivo Titanio",  "price": 12000, "speed_bonus": 2, "aesthetic_bonus": 4,  "resale_bonus": 3},
    {"id": "track_pack",    "name": "Track Package",             "price": 32000, "speed_bonus": 6, "aesthetic_bonus": 3,  "resale_bonus": 4},
    {"id": "launch_control","name": "Launch Control System",     "price": 5000,  "speed_bonus": 3, "aesthetic_bonus": 1,  "resale_bonus": 2},
    {"id": "roll_cage",     "name": "Jaula de Seguridad FIA",    "price": 15000, "speed_bonus": 3, "aesthetic_bonus": 2,  "resale_bonus": 2},
    {"id": "head_up",       "name": "Head-Up Display",           "price": 4500,  "speed_bonus": 0, "aesthetic_bonus": 3,  "resale_bonus": 2},
    {"id": "sport_audio",   "name": "Audio Burmester 3D",        "price": 8000,  "speed_bonus": 0, "aesthetic_bonus": 4,  "resale_bonus": 3},
    {"id": "night_vision",  "name": "Visión Nocturna",           "price": 7000,  "speed_bonus": 1, "aesthetic_bonus": 2,  "resale_bonus": 3},
    {"id": "lifter",        "name": "Elevación Frontal Hidráulica","price": 3500, "speed_bonus": 0, "aesthetic_bonus": 1, "resale_bonus": 2},
    {"id": "panoramic",     "name": "Techo Cristal Panorámico",  "price": 9000,  "speed_bonus": 0, "aesthetic_bonus": 5,  "resale_bonus": 3},
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

def calculate_scores(brand, model, engine, color_name, extras_ids,
                     wheel_id='serie', interior_id='nappa_negro', caliper_id='red'):
    speed = 50
    aesthetic = 50
    resale = 50

    if brand in CAR_DATA:
        bd = CAR_DATA[brand]
        if model in bd["models"]:
            m = bd["models"][model]
            speed     += m.get("speed_bonus", 0)
            aesthetic += m.get("aesthetic_bonus", 0)
            resale    += m.get("resale_bonus", 0)
        if engine in bd["engines"]:
            e = bd["engines"][engine]
            speed  += e.get("speed_bonus", 0)
            resale += e.get("resale_bonus", 0)

    for c in COLORS:
        if c["name"] == color_name:
            aesthetic += c.get("aesthetic_bonus", 0)
            break

    for w in WHEELS:
        if w["id"] == wheel_id:
            speed     += w.get("speed_bonus", 0)
            aesthetic += w.get("aesthetic_bonus", 0)
            break

    for i in INTERIORS:
        if i["id"] == interior_id:
            aesthetic += i.get("aesthetic_bonus", 0)
            resale    += i.get("resale_bonus", 0)
            break

    for cal in CALIPERS:
        if cal["id"] == caliper_id:
            aesthetic += cal.get("aesthetic_bonus", 0)
            break

    for ex in EXTRAS:
        if ex["id"] in extras_ids:
            speed     += ex.get("speed_bonus", 0)
            aesthetic += ex.get("aesthetic_bonus", 0)
            resale    += ex.get("resale_bonus", 0)

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
        email    = request.form.get('email', '').strip()
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
                budget=5000000.0
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
    wheel_names    = {w['id']: w['name']    for w in WHEELS}
    interior_names = {i['id']: i['name']    for i in INTERIORS}
    caliper_names  = {c['id']: c['name']    for c in CALIPERS}
    caliper_hexes  = {c['id']: c['hex']     for c in CALIPERS}
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
            'wheel_id': b.wheel_id or 'serie',
            'wheel_name': wheel_names.get(b.wheel_id or 'serie', 'Serie'),
            'interior_id': b.interior_id or 'nappa_negro',
            'interior_name': interior_names.get(b.interior_id or 'nappa_negro', 'Nappa Negro'),
            'caliper_id': b.caliper_id or 'red',
            'caliper_name': caliper_names.get(b.caliper_id or 'red', 'Rojo'),
            'caliper_hex': caliper_hexes.get(b.caliper_id or 'red', '#CC0000'),
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
    return render_template('builder.html',
        user=user,
        car_data=CAR_DATA,
        colors=COLORS,
        wheels=WHEELS,
        calipers=CALIPERS,
        interiors=INTERIORS,
        extras=EXTRAS
    )

@app.route('/api/car-data')
@login_required
def api_car_data():
    return jsonify(CAR_DATA)

@app.route('/api/save-build', methods=['POST'])
@login_required
def save_build():
    data = request.json
    user = User.query.get(session['user_id'])

    brand       = data.get('brand')
    model       = data.get('model')
    engine      = data.get('engine')
    color       = data.get('color')
    color_hex   = data.get('color_hex', '#000000')
    wheel_id    = data.get('wheel_id', 'serie')
    interior_id = data.get('interior_id', 'nappa_negro')
    caliper_id  = data.get('caliper_id', 'red')
    extras_ids  = data.get('extras', [])
    total_price = data.get('total_price', 0)
    build_name  = data.get('name', f'{brand} {model}')

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
    db.session.add(build)
    db.session.commit()
    return jsonify({'success': True, 'build_id': build.id,
                    'speed': speed, 'aesthetic': aesthetic, 'resale': resale})

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
    data        = request.json
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
    # Migrar columnas nuevas en instalaciones existentes
    from sqlalchemy import text
    new_cols = [
        ('wheel_id',    "TEXT DEFAULT 'serie'"),
        ('interior_id', "TEXT DEFAULT 'nappa_negro'"),
        ('caliper_id',  "TEXT DEFAULT 'red'"),
    ]
    for col, col_def in new_cols:
        try:
            with db.engine.connect() as conn:
                conn.execute(text(f'ALTER TABLE car_build ADD COLUMN {col} {col_def}'))
                conn.commit()
        except Exception:
            pass

if __name__ == '__main__':
    app.run(debug=True, port=5000)
