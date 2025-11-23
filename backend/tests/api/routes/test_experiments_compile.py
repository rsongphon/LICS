from fastapi.testclient import TestClient
from sqlmodel import Session

from app import crud
from app.core.config import settings
from app.schemas.experiment import ExperimentUpdate
from tests.utils.experiment import create_random_experiment

def test_compile_experiment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    # 1. Create experiment
    experiment = create_random_experiment(db)
    
    # 2. Update with psyexp_data
    psyexp_data = {
        "react_flow": {
            "nodes": [
                {"id": "1", "type": "text", "data": {"label": "Test Node"}}
            ]
        }
    }
    crud.update_experiment(
        session=db, 
        db_experiment=experiment, 
        experiment_in=ExperimentUpdate(psyexp_data=psyexp_data)
    )
    
    # 3. Call compile endpoint
    response = client.post(
        f"{settings.API_V1_STR}/experiments/{experiment.id}/compile",
        headers=superuser_token_headers,
    )
    
    # 4. Verify response
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == str(experiment.id)
    assert content["python_code"] is not None
    assert "expName" in content["python_code"]
    assert "# Node: Test Node (text)" in content["python_code"]
    
    # 5. Verify DB update
    db.refresh(experiment)
    assert experiment.python_code is not None
    assert "# Node: Test Node (text)" in experiment.python_code
