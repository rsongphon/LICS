import uuid
from typing import Any

from sqlmodel import Session, select

from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate


def create_device(*, session: Session, device_in: DeviceCreate) -> Device:
    db_obj = Device.model_validate(device_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_device(*, session: Session, device_id: uuid.UUID) -> Device | None:
    return session.get(Device, device_id)


def get_device_by_device_id(*, session: Session, device_id: str) -> Device | None:
    statement = select(Device).where(Device.device_id == device_id)
    return session.exec(statement).first()


def get_devices(*, session: Session, skip: int = 0, limit: int = 100) -> list[Device]:
    statement = select(Device).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_device(
    *, session: Session, db_device: Device, device_in: DeviceUpdate
) -> Device:
    device_data = device_in.model_dump(exclude_unset=True)
    db_device.sqlmodel_update(device_data)
    session.add(db_device)
    session.commit()
    session.refresh(db_device)
    return db_device


def delete_device(*, session: Session, db_device: Device) -> Device:
    session.delete(db_device)
    session.commit()
    return db_device
