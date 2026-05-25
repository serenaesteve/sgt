# 🏎️ SuperCar Builder

Configurador de supercars estilo Ferrari/Porsche con mecánicas de juego: desafíos diarios, carreras virtuales y asesor IA con Ollama.

## Stack
- Flask + SQLite + Ollama (LLaMA 3)
- HTML/CSS/JS + Jinja2
- Sin dependencias externas de pago

## Instalación

```bash
pip install -r requirements.txt --break-system-packages
python app.py
```

## Ollama (para IA)
```bash
ollama serve
ollama pull llama3
```

## Acceso
http://localhost:5000

## Mecánicas de juego

### 💰 Presupuesto
- Cada usuario empieza con **€500,000**
- El precio del coche se descuenta del presupuesto al guardar
- Gana dinero con desafíos y carreras

### 🏆 Desafíos diarios
- 5 desafíos con condiciones distintas (presupuesto máx, puntuación mín, marca específica...)
- Recompensas entre €50,000 y €120,000
- Se marcan como completados en localStorage

### 🏁 Carreras virtuales
- Compite con cualquier build guardado
- Rivales aleatorios con puntuación de velocidad variable
- Apuesta entre €5,000 y €100,000
- Factor de aleatoriedad ±5 puntos sobre tu velocidad base

### 📊 Puntuación
- **Velocidad**: depende del motor, modelo y extras de rendimiento
- **Estética**: depende del color, diseño del modelo y extras visuales
- **Reventa**: depende de la marca, configuración y exclusividad

## Marcas disponibles
- Ferrari (desde €220,000)
- Lamborghini (desde €200,000)
- Porsche (desde €120,000)
- McLaren (desde €180,000)
- Bugatti (desde €2,500,000)
