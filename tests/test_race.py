from tests.conftest import register


def test_race_start_rejects_arbitrary_bet_amount(client):
    register(client)
    resp = client.post('/api/race/start', json={'bet': 999999999})
    assert resp.status_code == 400


def test_race_start_deducts_bet_immediately(client):
    register(client)
    resp = client.post('/api/race/start', json={'bet': 5000})
    data = resp.get_json()
    assert data['success'] is True
    assert data['new_budget'] == 5000000.0 - 5000


def test_race_result_win_pays_double_the_bet(client):
    register(client)
    start = client.post('/api/race/start', json={'bet': 5000}).get_json()
    resp = client.post('/api/race/result', json={'race_token': start['race_token'], 'won': True})
    data = resp.get_json()
    assert data['success'] is True
    assert data['new_budget'] == 5000000.0 - 5000 + 10000


def test_race_result_loss_keeps_bet_deducted(client):
    register(client)
    start = client.post('/api/race/start', json={'bet': 5000}).get_json()
    resp = client.post('/api/race/result', json={'race_token': start['race_token'], 'won': False})
    data = resp.get_json()
    assert data['new_budget'] == 5000000.0 - 5000


def test_race_result_rejects_unknown_token(client):
    register(client)
    resp = client.post('/api/race/result', json={'race_token': 'forged-token', 'won': True})
    assert resp.status_code == 400


def test_race_result_cannot_be_replayed_for_double_payout(client):
    register(client)
    start = client.post('/api/race/start', json={'bet': 5000}).get_json()
    client.post('/api/race/result', json={'race_token': start['race_token'], 'won': True})
    resp = client.post('/api/race/result', json={'race_token': start['race_token'], 'won': True})
    assert resp.status_code == 400
