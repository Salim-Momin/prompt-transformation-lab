from fastapi import APIRouter

from src.api.routes.history import (
    router as history_router,
)
from src.api.routes.system import (
    router as system_router,
)
from src.api.routes.transform import (
    router as transform_router,
)

from src.api.routes.auth import (
    router as auth_router,
)


router = APIRouter()

router.include_router(auth_router)
router.include_router(system_router)
router.include_router(transform_router)
router.include_router(history_router)


__all__ = ["router"]