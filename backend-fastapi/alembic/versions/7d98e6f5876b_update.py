"""update

Revision ID: 7d98e6f5876b
Revises: 9c61d38d1d98
Create Date: 2025-07-15 00:50:45.415449

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '7d98e6f5876b'
down_revision: Union[str, Sequence[str], None] = '9c61d38d1d98'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
