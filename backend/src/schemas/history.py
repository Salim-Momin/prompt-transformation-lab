from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.schemas.response import PromptTransformation


class PromptHistoryCreate(PromptTransformation):
    """Internal schema used when saving a transformation."""

    pass


class PromptHistoryRead(PromptTransformation):
    """Complete prompt-history record."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    is_favorite: bool
    created_at: datetime
    updated_at: datetime


class PromptHistorySummary(BaseModel):
    """Compact history record for lists and sidebars."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    weak_prompt: str
    category: str
    role: str
    is_favorite: bool
    created_at: datetime


class PromptHistoryListResponse(BaseModel):
    """Paginated history response."""

    items: list[PromptHistorySummary]
    total: int
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class FavoriteUpdateRequest(BaseModel):
    """Request used to update a favorite state."""

    is_favorite: bool


class DeleteHistoryResponse(BaseModel):
    """Response returned after deleting one record."""

    deleted: bool
    history_id: int


class ClearHistoryResponse(BaseModel):
    """Response returned after clearing history."""

    deleted_count: int