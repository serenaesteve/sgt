import os
import secrets
import warnings


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY:
        SECRET_KEY = secrets.token_hex(32)
        warnings.warn(
            'SECRET_KEY no está definida en el entorno — se generó una clave aleatoria '
            'para esta ejecución. Las sesiones de los usuarios no sobrevivirán a un reinicio. '
            'Define la variable de entorno SECRET_KEY para producción.',
            stacklevel=2,
        )

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///supercar.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DEBUG = os.environ.get('FLASK_DEBUG', '0') == '1'

    WTF_CSRF_TIME_LIMIT = None
    RATELIMIT_STORAGE_URI = os.environ.get('RATELIMIT_STORAGE_URI', 'memory://')


class TestConfig(Config):
    SECRET_KEY = 'test-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True
    WTF_CSRF_ENABLED = False
    RATELIMIT_ENABLED = False
