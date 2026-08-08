from sqlalchemy import delete, func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from src.database.models import PromptHistory, User
from src.schemas import PromptTransformation


class PromptHistoryRepositoryError(RuntimeError):
    """Raised when a prompt-history database operation fails."""


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    """Return a user by ID."""

    return db.get(User, user_id)


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """Return a user by normalized email address."""

    normalized_email = email.strip().lower()

    statement = select(User).where(
        func.lower(User.email)
        == normalized_email
    )

    return db.scalar(statement)


def create_user(
    db: Session,
    *,
    name: str,
    email: str,
    password_hash: str,
) -> User:
    """Create and save one registered user."""

    user = User(
        name=name.strip(),
        email=email.strip().lower(),
        password_hash=password_hash,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    except SQLAlchemyError as error:
        db.rollback()

        raise PromptHistoryRepositoryError(
            "The user account could not be created."
        ) from error

def create_prompt_history(
    db: Session,
    transformation: PromptTransformation,
    user_id: int,
) -> PromptHistory:
    """Save one transformation for one authenticated user."""

    transformation_dict = transformation.model_dump(
        mode="json",
    )

    record = PromptHistory(
        user_id=user_id,
        weak_prompt=transformation.weak_prompt,
        intent=transformation.intent,
        category=transformation.category,
        role=transformation.role,
        goal=transformation.goal,
        audience=transformation.audience,
        missing_information=transformation.missing_information,
        context_questions=transformation.context_questions,
        assumptions=transformation.assumptions,
        requirements=transformation.requirements,
        constraints=transformation.constraints,
        output_format=transformation.output_format,
        success_criteria=transformation.success_criteria,
        improved_prompt=transformation.improved_prompt,
        transformation_data=transformation_dict,
    )

    try:
        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    except SQLAlchemyError as error:
        db.rollback()

        raise PromptHistoryRepositoryError(
            "The transformation could not be saved."
        ) from error

def get_prompt_history_by_id(
    db: Session,
    history_id: int,
    user_id: int,
) -> PromptHistory | None:
    """Return a record only when it belongs to the user."""

    statement = select(PromptHistory).where(
        PromptHistory.id == history_id,
        PromptHistory.user_id == user_id,
    )

    return db.scalar(statement)

def list_prompt_history(
    db: Session,
    *,
    user_id: int,
    limit: int = 20,
    offset: int = 0,
    category: str | None = None,
    favorites_only: bool = False,
    search: str | None = None,
) -> list[PromptHistory]:
    """Return only the authenticated user's history."""

    statement = select(PromptHistory).where(
        PromptHistory.user_id == user_id
    )

    if category:
        statement = statement.where(
            func.lower(PromptHistory.category)
            == category.strip().lower()
        )

    if favorites_only:
        statement = statement.where(
            PromptHistory.is_favorite.is_(True)
        )

    if search and search.strip():
        pattern = f"%{search.strip()}%"

        statement = statement.where(
            or_(
                PromptHistory.weak_prompt.ilike(pattern),
                PromptHistory.improved_prompt.ilike(pattern),
                PromptHistory.role.ilike(pattern),
                PromptHistory.audience.ilike(pattern),
                PromptHistory.category.ilike(pattern),
            )
        )

    statement = (
        statement
        .order_by(PromptHistory.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    return list(db.scalars(statement).all())

def count_prompt_history(
    db: Session,
    *,
    user_id: int,
    category: str | None = None,
    favorites_only: bool = False,
    search: str | None = None,
) -> int:
    """Count only the authenticated user's history."""

    statement = (
        select(func.count(PromptHistory.id))
        .where(PromptHistory.user_id == user_id)
    )

    if category:
        statement = statement.where(
            func.lower(PromptHistory.category)
            == category.strip().lower()
        )

    if favorites_only:
        statement = statement.where(
            PromptHistory.is_favorite.is_(True)
        )

    if search and search.strip():
        pattern = f"%{search.strip()}%"

        statement = statement.where(
            or_(
                PromptHistory.weak_prompt.ilike(pattern),
                PromptHistory.improved_prompt.ilike(pattern),
                PromptHistory.role.ilike(pattern),
                PromptHistory.audience.ilike(pattern),
                PromptHistory.category.ilike(pattern),
            )
        )

    return db.scalar(statement) or 0

def update_prompt_favorite(
    db: Session,
    history_id: int,
    user_id: int,
    is_favorite: bool,
) -> PromptHistory | None:
    """Update a favorite only when the record belongs to the user."""

    record = get_prompt_history_by_id(
        db,
        history_id,
        user_id,
    )

    if record is None:
        return None

    try:
        record.is_favorite = is_favorite

        db.commit()
        db.refresh(record)

        return record

    except SQLAlchemyError as error:
        db.rollback()

        raise PromptHistoryRepositoryError(
            "The favorite state could not be updated."
        ) from error

def delete_prompt_history(
    db: Session,
    history_id: int,
    user_id: int,
) -> bool:
    """Delete a record only when it belongs to the user."""

    record = get_prompt_history_by_id(
        db,
        history_id,
        user_id,
    )

    if record is None:
        return False

    try:
        db.delete(record)
        db.commit()

        return True

    except SQLAlchemyError as error:
        db.rollback()

        raise PromptHistoryRepositoryError(
            "The history record could not be deleted."
        ) from error

def delete_all_prompt_history(
    db: Session,
    user_id: int,
) -> int:
    """Delete all records owned by one user."""

    total = count_prompt_history(
        db,
        user_id=user_id,
    )

    try:
        statement = delete(PromptHistory).where(
            PromptHistory.user_id == user_id
        )

        db.execute(statement)
        db.commit()

        return total

    except SQLAlchemyError as error:
        db.rollback()

        raise PromptHistoryRepositoryError(
            "Prompt history could not be cleared."
        ) from error