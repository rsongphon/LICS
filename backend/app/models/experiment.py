import uuid
import enum
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User

class ExperimentStatus(str, enum.Enum):
    DRAFT = "draft"
    COMPILED = "compiled"
    DEPLOYED = "deployed"

class ExperimentBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = Field(default=None, sa_column=Column(Text))
    psyexp_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    python_code: str | None = Field(default=None, sa_column=Column(Text))
    psychojs_code: str | None = Field(default=None, sa_column=Column(Text))
    version: int = Field(default=1)
    status: ExperimentStatus = Field(default=ExperimentStatus.DRAFT)
    is_active: bool = Field(default=True)

class Experiment(ExperimentBase, table=True):
    __tablename__ = "experiments" # Explicit table name if desired, usually plural
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    
    created_by: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: "User" = Relationship(back_populates="experiments")
