from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from src.core.config import get_settings


settings = get_settings()


engine = create_engine(
    settings.database_url_value,
    echo=settings.database_echo,
    pool_pre_ping=True,
    pool_recycle=1800,
)


SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autoflush=False,
    expire_on_commit=False,
)


def get_db_session() -> Generator[Session, None, None]:
    """
    Provide one database session per FastAPI request.

    The session is always closed after the request finishes.
    Transactions should be committed or rolled back by the
    CRUD/service operation performing the database write.
    """

    database_session = SessionLocal()

    try:
        yield database_session
    finally:
        database_session.close()