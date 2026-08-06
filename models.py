import json
from datetime import datetime

from extensions import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    budget = db.Column(db.Float, default=5000000.0)
    claimed_challenges = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    builds = db.relationship('CarBuild', backref='user', lazy=True)

    def claimed_ids(self):
        return json.loads(self.claimed_challenges) if self.claimed_challenges else []


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

    def to_dict(self, wheel_names=None, interior_names=None, caliper_names=None, caliper_hexes=None):
        wheel_names = wheel_names or {}
        interior_names = interior_names or {}
        caliper_names = caliper_names or {}
        caliper_hexes = caliper_hexes or {}
        return {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'model': self.model,
            'engine': self.engine,
            'color': self.color,
            'color_hex': self.color_hex,
            'wheel_id': self.wheel_id or 'serie',
            'wheel_name': wheel_names.get(self.wheel_id or 'serie', 'Serie'),
            'interior_id': self.interior_id or 'nappa_negro',
            'interior_name': interior_names.get(self.interior_id or 'nappa_negro', 'Nappa Negro'),
            'caliper_id': self.caliper_id or 'red',
            'caliper_name': caliper_names.get(self.caliper_id or 'red', 'Rojo'),
            'caliper_hex': caliper_hexes.get(self.caliper_id or 'red', '#CC0000'),
            'extras': json.loads(self.extras) if self.extras else [],
            'total_price': self.total_price,
            'score_speed': self.score_speed,
            'score_aesthetic': self.score_aesthetic,
            'score_resale': self.score_resale,
            'created_at': self.created_at.strftime('%d/%m/%Y'),
        }
