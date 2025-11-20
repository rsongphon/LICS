from sqlmodel import Session

from app import crud
from app.schemas.experiment import ExperimentCreate
from tests.utils.user import create_random_user
from tests.utils.utils import random_lower_string


def test_create_experiment(db: Session) -> None:
    user = create_random_user(db)
    name = random_lower_string()
    description = random_lower_string()
    experiment_in = ExperimentCreate(name=name, description=description)
    experiment = crud.create_experiment_with_owner(
        session=db, experiment_in=experiment_in, owner_id=user.id
    )
    assert experiment.name == name
    assert experiment.description == description
    assert experiment.created_by == user.id


def test_get_experiment(db: Session) -> None:
    user = create_random_user(db)
    name = random_lower_string()
    description = random_lower_string()
    experiment_in = ExperimentCreate(name=name, description=description)
    experiment = crud.create_experiment_with_owner(
        session=db, experiment_in=experiment_in, owner_id=user.id
    )
    stored_experiment = crud.get_experiment(session=db, experiment_id=experiment.id)
    assert stored_experiment
    assert stored_experiment.name == experiment.name
    assert stored_experiment.id == experiment.id


def test_get_experiments_by_owner(db: Session) -> None:
    user = create_random_user(db)
    name = random_lower_string()
    description = random_lower_string()
    experiment_in = ExperimentCreate(name=name, description=description)
    crud.create_experiment_with_owner(
        session=db, experiment_in=experiment_in, owner_id=user.id
    )
    stored_experiments = crud.get_experiments_by_owner(session=db, owner_id=user.id)
    assert len(stored_experiments) == 1
    assert stored_experiments[0].name == name


def test_update_experiment(db: Session) -> None:
    user = create_random_user(db)
    name = random_lower_string()
    description = random_lower_string()
    experiment_in = ExperimentCreate(name=name, description=description)
    experiment = crud.create_experiment_with_owner(
        session=db, experiment_in=experiment_in, owner_id=user.id
    )
    new_name = random_lower_string()
    experiment_update = ExperimentCreate(name=new_name)
    updated_experiment = crud.update_experiment(
        session=db, db_experiment=experiment, experiment_in=experiment_update
    )
    assert updated_experiment.name == new_name
    assert updated_experiment.description == description


def test_delete_experiment(db: Session) -> None:
    user = create_random_user(db)
    name = random_lower_string()
    description = random_lower_string()
    experiment_in = ExperimentCreate(name=name, description=description)
    experiment = crud.create_experiment_with_owner(
        session=db, experiment_in=experiment_in, owner_id=user.id
    )
    crud.delete_experiment(session=db, db_experiment=experiment)
    stored_experiment = crud.get_experiment(session=db, experiment_id=experiment.id)
    assert stored_experiment is None
