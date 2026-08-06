# ─── DATOS DE COCHES ────────────────────────────────────────
CAR_DATA = {
    "Ferrari": {
        "base_price": 240000,
        "country": "Italia",
        "accent": "#C41230",
        "models": {
            "296 GTB":       {"price": 0,       "speed_bonus": 18, "aesthetic_bonus": 22, "resale_bonus": 16, "dims": {"l": 4.57, "w": 1.96, "h": 1.19}},
            "Roma":          {"price": 40000,    "speed_bonus": 15, "aesthetic_bonus": 26, "resale_bonus": 17, "dims": {"l": 4.66, "w": 1.97, "h": 1.30}},
            "12 Cilindri":   {"price": 180000,   "speed_bonus": 22, "aesthetic_bonus": 28, "resale_bonus": 19, "dims": {"l": 4.73, "w": 1.96, "h": 1.30}},
            "SF90 Stradale": {"price": 280000,   "speed_bonus": 26, "aesthetic_bonus": 24, "resale_bonus": 20, "dims": {"l": 4.71, "w": 1.97, "h": 1.19}},
            "F80":           {"price": 3200000,  "speed_bonus": 38, "aesthetic_bonus": 35, "resale_bonus": 30, "dims": {"l": 4.84, "w": 2.07, "h": 1.14}},
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
            "Huracán Sterrato": {"price": 0,      "speed_bonus": 18, "aesthetic_bonus": 22, "resale_bonus": 15, "dims": {"l": 4.52, "w": 2.02, "h": 1.22}},
            "Huracán STO":      {"price": 60000,  "speed_bonus": 24, "aesthetic_bonus": 25, "resale_bonus": 17, "dims": {"l": 4.53, "w": 1.94, "h": 1.22}},
            "Temerario":        {"price": 220000, "speed_bonus": 26, "aesthetic_bonus": 26, "resale_bonus": 20, "dims": {"l": 4.74, "w": 2.00, "h": 1.18}},
            "Revuelto":         {"price": 380000, "speed_bonus": 30, "aesthetic_bonus": 28, "resale_bonus": 22, "dims": {"l": 4.86, "w": 2.04, "h": 1.18}},
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
            "911 Carrera GTS":    {"price": 0,      "speed_bonus": 16, "aesthetic_bonus": 20, "resale_bonus": 22, "dims": {"l": 4.54, "w": 1.85, "h": 1.30}},
            "Cayman GT4 RS":      {"price": 50000,  "speed_bonus": 20, "aesthetic_bonus": 21, "resale_bonus": 22, "dims": {"l": 4.46, "w": 1.82, "h": 1.27}},
            "911 GT3":            {"price": 100000, "speed_bonus": 24, "aesthetic_bonus": 22, "resale_bonus": 24, "dims": {"l": 4.57, "w": 1.85, "h": 1.27}},
            "911 GT3 RS":         {"price": 150000, "speed_bonus": 26, "aesthetic_bonus": 23, "resale_bonus": 24, "dims": {"l": 4.59, "w": 1.90, "h": 1.28}},
            "Panamera Turbo S":   {"price": 220000, "speed_bonus": 20, "aesthetic_bonus": 25, "resale_bonus": 24, "dims": {"l": 5.05, "w": 1.94, "h": 1.43}},
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
            "Artura":  {"price": 0,       "speed_bonus": 19, "aesthetic_bonus": 21, "resale_bonus": 16, "dims": {"l": 4.53, "w": 1.93, "h": 1.19}},
            "GTS":     {"price": 60000,   "speed_bonus": 20, "aesthetic_bonus": 22, "resale_bonus": 17, "dims": {"l": 4.68, "w": 1.94, "h": 1.19}},
            "750S":    {"price": 120000,  "speed_bonus": 25, "aesthetic_bonus": 23, "resale_bonus": 18, "dims": {"l": 4.55, "w": 1.93, "h": 1.20}},
            "W1":      {"price": 1800000, "speed_bonus": 38, "aesthetic_bonus": 34, "resale_bonus": 28, "dims": {"l": 4.74, "w": 2.06, "h": 1.14}},
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
            "DB12":     {"price": 0,      "speed_bonus": 15, "aesthetic_bonus": 24, "resale_bonus": 18, "dims": {"l": 4.72, "w": 1.97, "h": 1.29}},
            "Vantage":  {"price": 50000,  "speed_bonus": 18, "aesthetic_bonus": 22, "resale_bonus": 18, "dims": {"l": 4.49, "w": 1.94, "h": 1.27}},
            "Vanquish": {"price": 180000, "speed_bonus": 20, "aesthetic_bonus": 26, "resale_bonus": 20, "dims": {"l": 4.78, "w": 2.00, "h": 1.30}},
            "Valhalla": {"price": 600000, "speed_bonus": 32, "aesthetic_bonus": 30, "resale_bonus": 25, "dims": {"l": 4.86, "w": 2.01, "h": 1.20}},
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
            "Chiron Super Sport": {"price": 0,       "speed_bonus": 38, "aesthetic_bonus": 30, "resale_bonus": 28, "dims": {"l": 4.54, "w": 2.04, "h": 1.21}},
            "Tourbillon":         {"price": 2500000, "speed_bonus": 45, "aesthetic_bonus": 38, "resale_bonus": 35, "dims": {"l": 4.67, "w": 2.03, "h": 1.19}},
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
            "MC20":               {"price": 0,      "speed_bonus": 20, "aesthetic_bonus": 24, "resale_bonus": 16, "dims": {"l": 4.67, "w": 1.96, "h": 1.22}},
            "MC20 Cielo":         {"price": 65000,  "speed_bonus": 19, "aesthetic_bonus": 26, "resale_bonus": 17, "dims": {"l": 4.67, "w": 1.96, "h": 1.22}},
            "GranTurismo Folgore":{"price": 80000,  "speed_bonus": 22, "aesthetic_bonus": 26, "resale_bonus": 18, "dims": {"l": 4.97, "w": 1.96, "h": 1.35}},
            "GranCabrio Folgore": {"price": 100000, "speed_bonus": 20, "aesthetic_bonus": 28, "resale_bonus": 19, "dims": {"l": 4.97, "w": 1.96, "h": 1.34}},
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
            "Mustang GT":        {"price": 0,     "speed_bonus": 13, "aesthetic_bonus": 18, "resale_bonus": 12, "dims": {"l": 4.81, "w": 1.92, "h": 1.40}},
            "Mustang Mach 1":    {"price": 12000, "speed_bonus": 15, "aesthetic_bonus": 20, "resale_bonus": 13, "dims": {"l": 4.81, "w": 1.92, "h": 1.40}},
            "Mustang Dark Horse":{"price": 22000, "speed_bonus": 17, "aesthetic_bonus": 22, "resale_bonus": 14, "dims": {"l": 4.81, "w": 1.92, "h": 1.40}},
            "Shelby GT500":      {"price": 38000, "speed_bonus": 22, "aesthetic_bonus": 24, "resale_bonus": 16, "dims": {"l": 4.79, "w": 1.92, "h": 1.40}},
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
            "GT-R Premium":        {"price": 0,     "speed_bonus": 18, "aesthetic_bonus": 19, "resale_bonus": 16, "dims": {"l": 4.71, "w": 1.90, "h": 1.37}},
            "GT-R Track Edition":  {"price": 20000, "speed_bonus": 20, "aesthetic_bonus": 20, "resale_bonus": 17, "dims": {"l": 4.71, "w": 1.90, "h": 1.36}},
            "GT-R NISMO":          {"price": 60000, "speed_bonus": 24, "aesthetic_bonus": 22, "resale_bonus": 19, "dims": {"l": 4.71, "w": 1.90, "h": 1.35}},
            "GT-R NISMO Special":  {"price": 95000, "speed_bonus": 26, "aesthetic_bonus": 24, "resale_bonus": 20, "dims": {"l": 4.71, "w": 1.90, "h": 1.35}},
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
            "R8 V10":              {"price": 0,     "speed_bonus": 17, "aesthetic_bonus": 22, "resale_bonus": 17, "dims": {"l": 4.43, "w": 1.94, "h": 1.24}},
            "R8 Spyder":           {"price": 25000, "speed_bonus": 16, "aesthetic_bonus": 24, "resale_bonus": 18, "dims": {"l": 4.43, "w": 1.94, "h": 1.24}},
            "R8 V10 Performance":  {"price": 35000, "speed_bonus": 20, "aesthetic_bonus": 22, "resale_bonus": 18, "dims": {"l": 4.43, "w": 1.94, "h": 1.24}},
            "R8 V10 GT":           {"price": 80000, "speed_bonus": 23, "aesthetic_bonus": 24, "resale_bonus": 20, "dims": {"l": 4.43, "w": 1.94, "h": 1.23}},
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

# Apuestas permitidas en el modo carrera: cualquier otro valor se rechaza server-side.
ALLOWED_BETS = (0, 5000, 15000, 30000, 50000, 100000)

# ─── DESAFÍOS DIARIOS ───────────────────────────────────────
# La condición 'check' recibe la lista de builds del usuario (dicts, ver models.CarBuild.to_dict)
# y se evalúa en servidor — antes se validaba y pagaba desde el navegador.
CHALLENGES = {
    "ch1": {
        "name": "Eficiencia máxima", "desc": "Porsche o Maserati con velocidad ≥75", "reward": 250000,
        "check": lambda builds: any(b["brand"] in ("Porsche", "Maserati") and b["score_speed"] >= 75 for b in builds),
    },
    "ch2": {
        "name": "Maestro del asfalto", "desc": "Velocidad ≥90 en cualquier build", "reward": 400000,
        "check": lambda builds: any(b["score_speed"] >= 90 for b in builds),
    },
    "ch3": {
        "name": "Joya del paddock", "desc": "Estética ≥88 y velocidad ≥80", "reward": 350000,
        "check": lambda builds: any(b["score_aesthetic"] >= 88 and b["score_speed"] >= 80 for b in builds),
    },
    "ch4": {
        "name": "Cuore sportivo", "desc": "Ferrari con carbon_pack y aero_kit", "reward": 200000,
        "check": lambda builds: any(
            b["brand"] == "Ferrari" and "carbon_pack" in b["extras"] and "aero_kit" in b["extras"] for b in builds
        ),
    },
    "ch5": {
        "name": "Coleccionista", "desc": "3 o más builds en el garaje", "reward": 150000,
        "check": lambda builds: len(builds) >= 3,
    },
    "ch6": {
        "name": "Hypercar Club", "desc": "Build de Bugatti o Maserati", "reward": 600000,
        "check": lambda builds: any(b["brand"] in ("Bugatti", "Maserati") for b in builds),
    },
    "ch7": {
        "name": "Alcántara VIP", "desc": "Interior Alcántara Racing en cualquier build", "reward": 180000,
        "check": lambda builds: any(b["interior_id"] == "alcantara" for b in builds),
    },
}


def calculate_total_price(brand, model, engine, color_name, wheel_id, interior_id, caliper_id, extras_ids):
    """Recalcula el precio total en servidor a partir del catálogo — nunca confiar en el precio que manda el cliente."""
    if brand not in CAR_DATA:
        return None
    bd = CAR_DATA[brand]
    if model not in bd["models"] or engine not in bd["engines"]:
        return None

    total = bd["base_price"] + bd["models"][model]["price"] + bd["engines"][engine]["price"]

    color = next((c for c in COLORS if c["name"] == color_name), None)
    wheel = next((w for w in WHEELS if w["id"] == wheel_id), None)
    interior = next((i for i in INTERIORS if i["id"] == interior_id), None)
    caliper = next((c for c in CALIPERS if c["id"] == caliper_id), None)
    if not (color and wheel and interior and caliper):
        return None
    total += color["price"] + wheel["price"] + interior["price"] + caliper["price"]

    valid_extra_ids = {e["id"] for e in EXTRAS}
    if not set(extras_ids).issubset(valid_extra_ids):
        return None
    total += sum(e["price"] for e in EXTRAS if e["id"] in extras_ids)

    return total


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
