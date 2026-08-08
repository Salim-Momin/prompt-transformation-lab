from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from src.api.app import app
from src.database.base import Base
from src.database.session import get_db_session


TEST_DATABASE_URL = "sqlite+pysqlite:///:memory:"


test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
    poolclass=StaticPool,
)


TestingSessionLocal = sessionmaker(
    bind=test_engine,
    class_=Session,
    autoflush=False,
    expire_on_commit=False,
)


@pytest.fixture(autouse=True)
def prepare_database() -> Generator[
    None,
    None,
    None,
]:
    """Create clean tables for each test."""

    Base.metadata.create_all(
        bind=test_engine
    )

    yield

    Base.metadata.drop_all(
        bind=test_engine
    )


@pytest.fixture
def db_session() -> Generator[
    Session,
    None,
    None,
]:
    """Return one isolated test DB session."""

    database_session = (
        TestingSessionLocal()
    )

    try:
        yield database_session
    finally:
        database_session.close()


@pytest.fixture
def client() -> Generator[
    TestClient,
    None,
    None,
]:
    """Return a FastAPI client using the test DB."""

    def override_get_db_session():
        database_session = (
            TestingSessionLocal()
        )

        try:
            yield database_session
        finally:
            database_session.close()

    app.dependency_overrides[
        get_db_session
    ] = override_get_db_session

    with TestClient(
        app,
        headers={
            "host": "localhost",
        },
    ) as test_client:
        yield test_client

    app.dependency_overrides.clear()