from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from src.api.dependencies import (
    CurrentUser,
    get_gemini_service,
)

from src.schemas import (
    ErrorResponse,
    PromptTransformation,
    TransformPromptRequest,
)
from src.services.gemini_service import (
    EmptyGeminiResponseError,
    GeminiService,
    GeminiServiceError,
    InvalidGeminiResponseError,
)

from sqlalchemy.orm import Session

from src.database.crud import (
    PromptHistoryRepositoryError,
    create_prompt_history,
)
from src.database.session import get_db_session

router = APIRouter(
    tags=["Prompt Transformation"],
)


@router.post(
    "/transform",
    response_model=PromptTransformation,
    status_code=status.HTTP_200_OK,
    summary="Transform a weak prompt",
    description=(
        "Analyze a weak or incomplete prompt and return a "
        "structured professional prompt generated with Gemini."
    ),
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "The supplied prompt is invalid.",
        },
        status.HTTP_502_BAD_GATEWAY: {
            "model": ErrorResponse,
            "description": (
                "Gemini returned an empty or invalid response."
            ),
        },
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "model": ErrorResponse,
            "description": (
                "The Gemini service could not process the request."
            ),
        },
    },
)
def transform_prompt(
    request: TransformPromptRequest,
    current_user: CurrentUser,
    gemini_service: GeminiService = Depends(
        get_gemini_service
    ),
    db: Session = Depends(get_db_session),
) -> PromptTransformation:
    """Transform one weak prompt using Gemini."""

    try:
        transformation = (
            gemini_service.transform_prompt(
                request.prompt
            )
        )

        create_prompt_history(
            db,
            transformation,
            user_id=current_user.id,
        )

        return transformation

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    except (
        EmptyGeminiResponseError,
        InvalidGeminiResponseError,
    ) as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error

    except PromptHistoryRepositoryError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "The prompt was transformed but could not be "
                "saved to history."
            ),
        ) from error

    except GeminiServiceError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The AI service is temporarily unavailable. "
                "Please try again."
            ),
        ) from error