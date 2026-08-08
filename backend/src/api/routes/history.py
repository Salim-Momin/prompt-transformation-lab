from typing import Annotated

from fastapi import (
    APIRouter,
    HTTPException,
    Query,
    status,
)

from src.api.dependencies import (
    CurrentUser,
    DatabaseSession,
)
from src.database.crud import (
    PromptHistoryRepositoryError,
    count_prompt_history,
    delete_all_prompt_history,
    delete_prompt_history,
    get_prompt_history_by_id,
    list_prompt_history,
    update_prompt_favorite,
)
from src.schemas import (
    ClearHistoryResponse,
    DeleteHistoryResponse,
    ErrorResponse,
    FavoriteUpdateRequest,
    PromptHistoryListResponse,
    PromptHistoryRead,
    PromptHistorySummary,
)


router = APIRouter(
    prefix="/history",
    tags=["Prompt History"],
)


@router.get(
    "",
    response_model=PromptHistoryListResponse,
    summary="List current user history",
)
def get_history(
    db: DatabaseSession,
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    category: Annotated[
        str | None,
        Query(max_length=100),
    ] = None,
    favorites_only: bool = False,
    search: Annotated[
        str | None,
        Query(max_length=250),
    ] = None,
) -> PromptHistoryListResponse:
    """Return only the current user's history."""

    records = list_prompt_history(
        db,
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        category=category,
        favorites_only=favorites_only,
        search=search,
    )

    total = count_prompt_history(
        db,
        user_id=current_user.id,
        category=category,
        favorites_only=favorites_only,
        search=search,
    )

    return PromptHistoryListResponse(
        items=[
            PromptHistorySummary.model_validate(record)
            for record in records
        ],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/{history_id}",
    response_model=PromptHistoryRead,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
        },
    },
    summary="Get one owned history record",
)
def get_history_record(
    history_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> PromptHistoryRead:
    """Return a record only if the current user owns it."""

    record = get_prompt_history_by_id(
        db,
        history_id,
        current_user.id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt-history record not found.",
        )

    return PromptHistoryRead.model_validate(record)


@router.patch(
    "/{history_id}/favorite",
    response_model=PromptHistoryRead,
    summary="Update favorite status",
)
def update_favorite(
    history_id: int,
    request: FavoriteUpdateRequest,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> PromptHistoryRead:
    """Favorite or unfavorite one owned record."""

    try:
        record = update_prompt_favorite(
            db,
            history_id,
            current_user.id,
            request.is_favorite,
        )

    except PromptHistoryRepositoryError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The favorite state could not be updated.",
        ) from error

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt-history record not found.",
        )

    return PromptHistoryRead.model_validate(record)


@router.delete(
    "/{history_id}",
    response_model=DeleteHistoryResponse,
    summary="Delete one owned history record",
)
def remove_history_record(
    history_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> DeleteHistoryResponse:
    """Delete a record only if the current user owns it."""

    try:
        deleted = delete_prompt_history(
            db,
            history_id,
            current_user.id,
        )

    except PromptHistoryRepositoryError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The history record could not be deleted.",
        ) from error

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt-history record not found.",
        )

    return DeleteHistoryResponse(
        deleted=True,
        history_id=history_id,
    )


@router.delete(
    "",
    response_model=ClearHistoryResponse,
    summary="Clear current user history",
)
def clear_history(
    db: DatabaseSession,
    current_user: CurrentUser,
) -> ClearHistoryResponse:
    """Delete only the current user's records."""

    try:
        deleted_count = delete_all_prompt_history(
            db,
            current_user.id,
        )

    except PromptHistoryRepositoryError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prompt history could not be cleared.",
        ) from error

    return ClearHistoryResponse(
        deleted_count=deleted_count,
    )