from fastapi.testclient import TestClient


def test_root_endpoint(
    client: TestClient,
) -> None:
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == (
        "PromptForge AI API"
    )

    assert (
        "X-Request-ID"
        in response.headers
    )


def test_health_endpoint(
    client: TestClient,
) -> None:
    response = client.get(
        "/api/v1/health"
    )

    assert response.status_code == 200

    assert response.json() == {
        "status": "healthy",
        "service": "PromptForge AI",
        "version": "1.0.0",
    }


def test_readiness_endpoint(
    client: TestClient,
) -> None:
    response = client.get(
        "/api/v1/ready"
    )

    assert response.status_code == 200

    assert response.json() == {
        "status": "ready",
        "database": "connected",
        "service": "PromptForge AI",
        "version": "1.0.0",
    }