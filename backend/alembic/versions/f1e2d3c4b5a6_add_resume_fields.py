"""add resume fields

Revision ID: f1e2d3c4b5a6
Revises: a1b2c3d4e5f6
Create Date: 2026-01-15 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f1e2d3c4b5a6'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add career, skills and other structured fields to resumes
    op.add_column('resumes', sa.Column('job_role', sa.String(), nullable=True))
    op.add_column('resumes', sa.Column('key_strength', sa.String(), nullable=True))
    op.add_column('resumes', sa.Column('domain', sa.String(), nullable=True))

    op.add_column('resumes', sa.Column('technical_skills', postgresql.ARRAY(sa.String()), nullable=True))
    op.add_column('resumes', sa.Column('tools', postgresql.ARRAY(sa.String()), nullable=True))

    op.add_column('resumes', sa.Column('internships', postgresql.JSONB(), nullable=True))

    op.add_column('resumes', sa.Column('certifications', postgresql.ARRAY(sa.String()), nullable=True))
    op.add_column('resumes', sa.Column('achievements', postgresql.ARRAY(sa.String()), nullable=True))
    op.add_column('resumes', sa.Column('languages', postgresql.ARRAY(sa.String()), nullable=True))


def downgrade() -> None:
    op.drop_column('resumes', 'languages')
    op.drop_column('resumes', 'achievements')
    op.drop_column('resumes', 'certifications')
    op.drop_column('resumes', 'internships')
    op.drop_column('resumes', 'tools')
    op.drop_column('resumes', 'technical_skills')
    op.drop_column('resumes', 'domain')
    op.drop_column('resumes', 'key_strength')
    op.drop_column('resumes', 'job_role')
