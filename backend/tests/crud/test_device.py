from sqlmodel import Session

from app import crud
from app.schemas.device import DeviceCreate, DeviceUpdate
from tests.utils.utils import random_lower_string


def test_create_device(db: Session) -> None:
    device_id = random_lower_string()
    name = random_lower_string()
    device_in = DeviceCreate(device_id=device_id, name=name)
    device = crud.create_device(session=db, device_in=device_in)
    assert device.device_id == device_id
    assert device.name == name


def test_get_device(db: Session) -> None:
    device_id = random_lower_string()
    name = random_lower_string()
    device_in = DeviceCreate(device_id=device_id, name=name)
    device = crud.create_device(session=db, device_in=device_in)
    stored_device = crud.get_device(session=db, device_id=device.id)
    assert stored_device
    assert stored_device.name == device.name
    assert stored_device.id == device.id


def test_get_device_by_device_id(db: Session) -> None:
    device_id = random_lower_string()
    name = random_lower_string()
    device_in = DeviceCreate(device_id=device_id, name=name)
    crud.create_device(session=db, device_in=device_in)
    stored_device = crud.get_device_by_device_id(session=db, device_id=device_id)
    assert stored_device
    assert stored_device.name == name


def test_update_device(db: Session) -> None:
    device_id = random_lower_string()
    name = random_lower_string()
    device_in = DeviceCreate(device_id=device_id, name=name)
    device = crud.create_device(session=db, device_in=device_in)
    new_name = random_lower_string()
    device_update = DeviceUpdate(name=new_name)
    updated_device = crud.update_device(
        session=db, db_device=device, device_in=device_update
    )
    assert updated_device.name == new_name


def test_delete_device(db: Session) -> None:
    device_id = random_lower_string()
    name = random_lower_string()
    device_in = DeviceCreate(device_id=device_id, name=name)
    device = crud.create_device(session=db, device_in=device_in)
    crud.delete_device(session=db, db_device=device)
    stored_device = crud.get_device(session=db, device_id=device.id)
    assert stored_device is None
