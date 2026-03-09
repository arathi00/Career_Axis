"""merge quiz table migrations

Revision ID: d50cb9ea5035
Revises: add_company_quiz_tables, add_quiz_result_tables
Create Date: 2026-01-23 18:31:18.353445

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd50cb9ea5035'
down_revision: Union[str, Sequence[str], None] = ('add_company_quiz_tables', 'add_quiz_result_tables')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
