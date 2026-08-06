from tests.conftest import register


def save_build(client, **overrides):
    payload = {
        'name': 'Mi Ferrari',
        'brand': 'Ferrari',
        'model': '296 GTB',
        'engine': '3.0L V6 Turbo Ibrido 830CV',
        'color': 'Rosso Corsa',
        'color_hex': '#C41230',
        'wheel_id': 'serie',
        'interior_id': 'nappa_negro',
        'caliper_id': 'red',
        'extras': [],
    }
    payload.update(overrides)
    return client.post('/api/save-build', json=payload)


def test_save_build_ignores_client_supplied_price(client):
    register(client)
    resp = save_build(client, total_price=1)
    data = resp.get_json()
    assert data['success'] is True
    assert data['total_price'] == 240000  # Ferrari base_price, recalculado en servidor


def test_save_build_deducts_real_price_from_budget(client):
    register(client)
    resp = save_build(client)
    data = resp.get_json()
    assert data['new_budget'] == 5000000.0 - 240000


def test_save_build_rejects_when_price_exceeds_budget(client):
    register(client)
    resp = save_build(client, brand='Bugatti', model='Tourbillon', engine='V16 NA + Eléctrico 1800CV')
    assert resp.status_code == 400
    assert resp.get_json()['success'] is False


def test_save_build_rejects_unknown_model(client):
    register(client)
    resp = save_build(client, model='Modelo Inventado')
    assert resp.status_code == 400


def test_save_build_requires_login(client):
    resp = save_build(client)
    assert resp.status_code in (302, 401)
