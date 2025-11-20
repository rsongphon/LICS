import uuid
from sqlmodel import Session

from app.models import Device, DeviceStatus
from tests.utils.utils import random_lower_string

def test_create_device(db: Session) -> None:
    device_id = random_lower_string()
    name = random_lower_string()
    device = Device(device_id=device_id, name=name)
    db.add(device)
    db.commit()
    db.refresh(device)
    
    assert device.device_id == device_id
    assert device.name == name
    assert device.status == DeviceStatus.OFFLINE
    assert device.config == {}
    assert device.capabilities == {}
