import uuid
from sqlmodel import Session

from app.models import Experiment, User
from tests.utils.utils import random_email, random_lower_string

def test_create_experiment(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = User(email=email, hashed_password=password)
    db.add(user_in)
    db.commit()
    db.refresh(user_in)
    
    name = random_lower_string()
    experiment = Experiment(name=name, created_by=user_in.id)
    db.add(experiment)
    db.commit()
    db.refresh(experiment)
    
    assert experiment.name == name
    assert experiment.created_by == user_in.id
    assert experiment.owner == user_in
    assert experiment.psyexp_data == {}
    assert experiment.version == 1
