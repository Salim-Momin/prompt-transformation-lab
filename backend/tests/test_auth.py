from fastapi.testclient import TestClient


REGISTER_PAYLOAD = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123",
}


def register_user(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/v1/auth/register",
        json=REGISTER_PAYLOAD,
    )

    assert response.status_code == 201


def login_user(
    client: TestClient,
) -> str:
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": (
                REGISTER_PAYLOAD["email"]
            ),
            "password": (
                REGISTER_PAYLOAD[
                    "password"
                ]
            ),
        },
    )

    assert response.status_code == 200

    return response.json()[
        "access_token"
    ]


def test_register_user(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/v1/auth/register",
        json=REGISTER_PAYLOAD,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == (
        "test@example.com"
    )

    assert "password" not in data
    assert "password_hash" not in data


def test_duplicate_registration(
    client: TestClient,
) -> None:
    register_user(client)

    response = client.post(
        "/api/v1/auth/register",
        json=REGISTER_PAYLOAD,
    )

    assert response.status_code == 409


def test_login_and_current_user(
    client: TestClient,
) -> None:
    register_user(client)

    token = login_user(client)

    response = client.get(
        "/api/v1/auth/me",
        headers={
            "Authorization": (
                f"Bearer {token}"
            )
        },
    )

    assert response.status_code == 200

    assert response.json()["email"] == (
        "test@example.com"
    )


def test_current_user_requires_token(
    client: TestClient,
) -> None:
    response = client.get(
        "/api/v1/auth/me"
    )

    assert response.status_code == 401