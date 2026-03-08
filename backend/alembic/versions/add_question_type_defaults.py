"""Add question_type defaults and ensure quiz_id exists

Revision ID: add_question_type_defaults
Revises: d50cb9ea5035
Create Date: 2026-01-24 15:35:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_question_type_defaults'
down_revision = 'd50cb9ea5035'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add question_type column to questions if it doesn't exist
    try:
        op.add_column('questions', sa.Column('question_type', sa.String(), nullable=False, server_default='MCQ'))
    except:
        pass
    
    # Add question_type column to quizzes if it doesn't exist
    try:
        op.add_column('quizzes', sa.Column('question_type', sa.String(), nullable=False, server_default='MCQ'))
    except:
        pass


def downgrade() -> None:
    # Drop columns if downgrading
    try:
        op.drop_column('questions', 'question_type')
    except:
        pass
    
    try:
        op.drop_column('quizzes', 'question_type')
    except:
        pass
