from datetime import datetime
from typing import Any

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.base import Base

json_storage_type = JSON().with_variant(
    JSONB,
    "postgresql",
)

class User(Base):
    """A registered PromptForge user."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
        unique=True,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    prompt_history: Mapped[list["PromptHistory"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return (
            f"User(id={self.id!r}, "
            f"email={self.email!r})"
        )

class PromptHistory(Base):
    """A successfully generated prompt transformation."""

    __tablename__ = "prompt_history"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    user: Mapped["User | None"] = relationship(
        back_populates="prompt_history",
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    weak_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    intent: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    role: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    goal: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    audience: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    missing_information: Mapped[list[str]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=list,
    )

    context_questions: Mapped[list[str]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=list,
    )

    assumptions: Mapped[list[str]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=list,
    )

    requirements: Mapped[list[str]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=list,
    )

    constraints: Mapped[list[str]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=list,
    )

    output_format: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    success_criteria: Mapped[list[str]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=list,
    )

    improved_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    transformation_data: Mapped[dict[str, Any]] = mapped_column(
        json_storage_type,
        nullable=False,
        default=dict,
    )

    is_favorite: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    __table_args__ = (
        Index(
            "ix_prompt_history_category_created_at",
            "category",
            "created_at",
        ),
    )

    def __repr__(self) -> str:
        return (
            f"PromptHistory(id={self.id!r}, "
            f"category={self.category!r})"
        )