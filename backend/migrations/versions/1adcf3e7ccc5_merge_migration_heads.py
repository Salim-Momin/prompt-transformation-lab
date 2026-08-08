"""merge migration heads

Revision ID: 1adcf3e7ccc5
Revises: a2f344ddb14b
Create Date: 2026-08-06 14:18:31.435671

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1adcf3e7ccc5'
down_revision: Union[str, Sequence[str], None] = 'a2f344ddb14b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
