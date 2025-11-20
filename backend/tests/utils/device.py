from sqlmodel import Session

from app import crud
from app.models.device import Device
from app.schemas.device import DeviceCreate
from tests.utils.utils import random_lower_string


def create_random_device(db: Session) -> Device:
    device_id = random_lower_string()
    name = random_lower_string()
    device_in = DeviceCreate(device_id=device_id, name=name)
    return crud.create_device(session=db, device_in=device_in)
