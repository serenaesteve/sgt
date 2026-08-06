from tests.conftest import register
from tests.test_builds import save_build


def test_claim_challenge_requires_condition_met(client):
    register(client)
    resp = client.post('/api/claim-challenge', json={'challenge_id': 'ch5'})  # Coleccionista: 3+ builds
    assert resp.status_code == 400
    assert resp.get_json()['success'] is False


def test_claim_challenge_pays_reward_when_condition_met(client):
    register(client)
    for _ in range(3):
        save_build(client, name='build', brand='Ford', model='Mustang GT', engine='2.3L EcoBoost 315CV')
    resp = client.post('/api/claim-challenge', json={'challenge_id': 'ch5'})
    data = resp.get_json()
    assert data['success'] is True
    assert data['reward'] == 150000


def test_claim_challenge_twice_is_rejected(client):
    register(client)
    for _ in range(3):
        save_build(client, name='build', brand='Ford', model='Mustang GT', engine='2.3L EcoBoost 315CV')
    client.post('/api/claim-challenge', json={'challenge_id': 'ch5'})
    resp = client.post('/api/claim-challenge', json={'challenge_id': 'ch5'})
    assert resp.status_code == 400


def test_claim_unknown_challenge_rejected(client):
    register(client)
    resp = client.post('/api/claim-challenge', json={'challenge_id': 'does-not-exist'})
    assert resp.status_code == 400
