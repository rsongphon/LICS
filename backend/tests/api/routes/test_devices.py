from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.device import create_random_device
from tests.utils.utils import random_lower_string


def test_create_device(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    # Test registration via register endpoint (open or admin?)
    # Our register endpoint is open but checks for duplicates.
    # Wait, register endpoint is POST /devices/register
    # And we also have POST /devices/ (not implemented? No, only register in router)
    # Ah, I didn't implement POST /devices/ in router, only /register.
    # Let's check the router implementation again.
    # I implemented /register.
    
    data = {"device_id": random_lower_string(), "name": "Foo"}
    response = client.post(
        f"{settings.API_V1_STR}/devices/register",
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["device_id"] == data["device_id"]
    assert content["name"] == data["name"]
    assert "id" in content


def test_read_device(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    device = create_random_device(db)
    response = client.get(
        f"{settings.API_V1_STR}/devices/{device.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == device.name
    assert content["id"] == str(device.id)


def test_delete_device(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    device = create_random_device(db)
    response = client.delete(
        f"{settings.API_V1_STR}/devices/{device.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == str(device.id)
