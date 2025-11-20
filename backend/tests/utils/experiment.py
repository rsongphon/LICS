from sqlmodel import Session

from app import crud
from app.models.experiment import Experiment
from app.schemas.experiment import ExperimentCreate
from tests.utils.user import create_random_user
from tests.utils.utils import random_lower_string


def create_random_experiment(db: Session) -> Experiment:
    user = create_random_user(db)
    name = random_lower_string()
    description = random_lower_string()
    experiment_in = ExperimentCreate(name=name, description=description)
    return crud.create_experiment_with_owner(
        session=db, experiment_in=experiment_in, owner_id=user.id
    )
