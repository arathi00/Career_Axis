"""Add timing fields to quiz_results

Revision ID: add_quiz_result_timings
Revises: add_question_type_defaults
Create Date: 2026-01-26 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_quiz_result_timings'
down_revision = '54a3b24ed35d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('quiz_results', sa.Column('started_at', sa.DateTime(), nullable=True))
    op.add_column('quiz_results', sa.Column('finished_at', sa.DateTime(), nullable=True))

    op.create_index(op.f('ix_quiz_results_started_at'), 'quiz_results', ['started_at'], unique=False)
    op.create_index(op.f('ix_quiz_results_finished_at'), 'quiz_results', ['finished_at'], unique=False)

    # Backfill existing rows so legacy data has timing
    op.execute("UPDATE quiz_results SET started_at = COALESCE(started_at, submitted_at)")
    op.execute("UPDATE quiz_results SET finished_at = COALESCE(finished_at, submitted_at)")


def downgrade() -> None:
    op.drop_index(op.f('ix_quiz_results_finished_at'), table_name='quiz_results')
    op.drop_index(op.f('ix_quiz_results_started_at'), table_name='quiz_results')

    op.drop_column('quiz_results', 'finished_at')
    op.drop_column('quiz_results', 'started_at')
