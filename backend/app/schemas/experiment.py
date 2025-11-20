import uuid
from datetime import datetime
from typing import Any

from sqlmodel import SQLModel
from app.models.experiment import ExperimentBase, ExperimentStatus

class ExperimentCreate(ExperimentBase):
    pass

class ExperimentUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    psyexp_data: dict[str, Any] | None = None
    python_code: str | None = None
    psychojs_code: str | None = None
    version: int | None = None
    status: ExperimentStatus | None = None
    is_active: bool | None = None

class ExperimentPublic(ExperimentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    created_by: uuid.UUID

class ExperimentsPublic(SQLModel):
    data: list[ExperimentPublic]
    count: int
