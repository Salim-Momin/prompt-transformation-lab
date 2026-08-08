from fastapi.testclient import TestClient


def test_transform_requires_authentication(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/v1/transform",
        json={
            "prompt": (
                "Explain machine learning"
            )
        },
    )

    assert response.status_code == 401


def test_transform_rejects_empty_prompt(
    client: TestClient,
) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "Password123",
        },
    )

    assert (
        register_response.status_code
        == 201
    )

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": (
                "test@example.com"
            ),
            "password": "Password123",
        },
    )

    token = login_response.json()[
        "access_token"
    ]

    response = client.post(
        "/api/v1/transform",
        json={
            "prompt": "",
        },
        headers={
            "Authorization": (
                f"Bearer {token}"
            )
        },
    )

    assert response.status_code == 422

    data = response.json()

    assert data["detail"] == (
        "Request validation failed."
    )

    assert "request_id" in data