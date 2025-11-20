import uuid
from datetime import datetime
from typing import Any

from sqlmodel import Column, Field, SQLModel
from app.models.device import DeviceBase, DeviceStatus

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    location: str | None = None
    status: DeviceStatus | None = None
    config: dict[str, Any] | None = None
    capabilities: dict[str, Any] | None = None
    ip_address: str | None = None
    last_seen: datetime | None = None

class DevicePublic(DeviceBase):
    id: uuid.UUID
    registered_at: datetime
    registered_by: uuid.UUID | None

class DevicesPublic(SQLModel):
    data: list[DevicePublic]
    count: int

class DeviceRegister(SQLModel):
    device_id: str
    name: str
    location: str | None = None
    capabilities: dict[str, Any] = Field(default_factory=dict)
