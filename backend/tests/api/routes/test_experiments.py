from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.experiment import create_random_experiment
from tests.utils.utils import random_lower_string


def test_create_experiment(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"name": "Foo", "description": "Bar"}
    response = client.post(
        f"{settings.API_V1_STR}/experiments/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["description"] == data["description"]
    assert "id" in content
    assert "created_by" in content


def test_read_experiment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    experiment = create_random_experiment(db)
    response = client.get(
        f"{settings.API_V1_STR}/experiments/{experiment.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == experiment.name
    assert content["id"] == str(experiment.id)


def test_read_experiment_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/experiments/{random_lower_string()}",
        headers=superuser_token_headers,
    )
    # UUID parsing error might occur if random string is not UUID.
    # FastAPI validates UUID path params.
    # So if we pass a non-UUID string, it returns 422.
    # We should pass a random UUID.
    import uuid
    response = client.get(
        f"{settings.API_V1_STR}/experiments/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404


def test_delete_experiment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    experiment = create_random_experiment(db)
    response = client.delete(
        f"{settings.API_V1_STR}/experiments/{experiment.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == str(experiment.id)
