import uuid
import enum
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB, INET
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User

class DeviceStatus(str, enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    RUNNING = "running"

class DeviceBase(SQLModel):
    device_id: str = Field(unique=True, index=True, nullable=False)
    name: str
    description: str | None = None
    location: str | None = None
    status: DeviceStatus = Field(default=DeviceStatus.OFFLINE)
    config: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    capabilities: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    ip_address: str | None = Field(default=None, sa_column=Column(INET))
    last_seen: datetime | None = None

class Device(DeviceBase, table=True):
    __tablename__ = "devices"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    registered_at: datetime = Field(default_factory=datetime.utcnow)
    
    registered_by: uuid.UUID | None = Field(default=None, foreign_key="user.id", nullable=True)
    # owner: "User" = Relationship(back_populates="devices") # If we want to link to user
    
    api_key_hash: str | None = None
