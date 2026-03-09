"""clean up database state

Revision ID: 54a3b24ed35d
Revises: fca40f3a9821
Create Date: 2026-01-23 19:00:04.013823

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '54a3b24ed35d'
down_revision: Union[str, Sequence[str], None] = 'fca40f3a9821'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
