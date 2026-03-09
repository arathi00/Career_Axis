"""Create QuizResult and update Quiz models

Revision ID: add_quiz_result_tables
Revises: 22fed973e937
Create Date: 2024-01-21 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_quiz_result_tables'
down_revision = '22fed973e937'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create quiz_results table
    op.create_table(
        'quiz_results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('quiz_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('total', sa.Integer(), nullable=False),
        sa.Column('percentage', sa.Integer(), nullable=False),
        sa.Column('answers', sa.JSON(), nullable=False),
        sa.Column('submitted_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['quiz_id'], ['quizzes.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_quiz_results_quiz_id'), 'quiz_results', ['quiz_id'], unique=False)
    op.create_index(op.f('ix_quiz_results_user_id'), 'quiz_results', ['user_id'], unique=False)
    op.create_index(op.f('ix_quiz_results_submitted_at'), 'quiz_results', ['submitted_at'], unique=False)
    
    # Add quiz_id column to questions table if it doesn't exist
    try:
        op.add_column('questions', sa.Column('quiz_id', sa.Integer(), nullable=True))
        op.create_index(op.f('ix_questions_quiz_id'), 'questions', ['quiz_id'], unique=False)
        op.create_foreign_key('fk_questions_quiz_id', 'questions', 'quizzes', ['quiz_id'], ['id'])
    except:
        pass  # Column might already exist


def downgrade() -> None:
    # Drop quiz_results table
    op.drop_index(op.f('ix_quiz_results_submitted_at'), table_name='quiz_results')
    op.drop_index(op.f('ix_quiz_results_user_id'), table_name='quiz_results')
    op.drop_index(op.f('ix_quiz_results_quiz_id'), table_name='quiz_results')
    op.drop_table('quiz_results')
    
    # Remove quiz_id from questions
    try:
        op.drop_constraint('fk_questions_quiz_id', 'questions', type_='foreignkey')
        op.drop_index(op.f('ix_questions_quiz_id'), table_name='questions')
        op.drop_column('questions', 'quiz_id')
    except:
        pass
