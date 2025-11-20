import uuid
from typing import Any

from sqlmodel import Session, select

from app.models.experiment import Experiment
from app.schemas.experiment import ExperimentCreate, ExperimentUpdate


def create_experiment_with_owner(
    *, session: Session, experiment_in: ExperimentCreate, owner_id: uuid.UUID
) -> Experiment:
    db_obj = Experiment.model_validate(
        experiment_in, update={"created_by": owner_id}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_experiment(*, session: Session, experiment_id: uuid.UUID) -> Experiment | None:
    return session.get(Experiment, experiment_id)


def get_experiments_by_owner(
    *, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[Experiment]:
    statement = (
        select(Experiment)
        .where(Experiment.created_by == owner_id)
        .offset(skip)
        .limit(limit)
    )
    return session.exec(statement).all()


def update_experiment(
    *, session: Session, db_experiment: Experiment, experiment_in: ExperimentUpdate
) -> Experiment:
    experiment_data = experiment_in.model_dump(exclude_unset=True)
    db_experiment.sqlmodel_update(experiment_data)
    session.add(db_experiment)
    session.commit()
    session.refresh(db_experiment)
    return db_experiment


def delete_experiment(*, session: Session, db_experiment: Experiment) -> Experiment:
    session.delete(db_experiment)
    session.commit()
    return db_experiment
