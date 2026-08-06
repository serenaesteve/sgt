from tests.conftest import register


def test_register_creates_user_with_starting_budget(client):
    resp = register(client)
    assert resp.status_code == 200
    assert resp.request.path == '/garage'


def test_register_rejects_short_password(client):
    resp = register(client, password='short')
    assert b'8 caracteres' in resp.data


def test_register_rejects_invalid_email(client):
    resp = register(client, email='not-an-email')
    assert b'email v' in resp.data.lower()


def test_register_rejects_duplicate_username(client):
    register(client, username='dup', email='a@example.com')
    resp = register(client, username='dup', email='b@example.com')
    assert 'ya existe'.encode() in resp.data


def test_login_wrong_password_fails(client):
    register(client, username='pilot2', email='p2@example.com', password='correcthorse')
    client.get('/logout')
    resp = client.post('/login', data={'username': 'pilot2', 'password': 'wrongpass'})
    assert 'incorrectos'.encode() in resp.data


def test_login_rate_limited_after_many_attempts():
    from app import create_app
    from config import TestConfig

    class RateLimitedTestConfig(TestConfig):
        RATELIMIT_ENABLED = True

    app = create_app(RateLimitedTestConfig)
    client = app.test_client()
    for _ in range(10):
        client.post('/login', data={'username': 'nope', 'password': 'nope'})
    resp = client.post('/login', data={'username': 'nope', 'password': 'nope'})
    assert resp.status_code == 429
