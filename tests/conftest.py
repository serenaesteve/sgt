import pytest

from app import create_app
from config import TestConfig
from extensions import db


@pytest.fixture
def app():
    app = create_app(TestConfig)
    yield app
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def register(client, username='piloto', email='piloto@example.com', password='supersecreta'):
    return client.post('/register', data={
        'username': username, 'email': email, 'password': password,
    }, follow_redirects=True)


@pytest.fixture
def auth_client(client):
    register(client)
    return client
