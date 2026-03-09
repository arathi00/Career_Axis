"""Add company quiz tables

Revision ID: add_company_quiz_tables
Revises: 
Create Date: 2026-01-22

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_company_quiz_tables'
down_revision = None  # Update this with your latest migration ID
branch_label = None
depends_on = None


def upgrade():
    # Create companies table
    op.create_table(
        'companies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_companies_id'), 'companies', ['id'], unique=False)
    op.create_index(op.f('ix_companies_name'), 'companies', ['name'], unique=True)

    # Create quiz_levels table
    op.create_table(
        'quiz_levels',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('level', sa.Enum('EASY', 'MEDIUM', 'HARD', name='difficultylevel'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_levels_id'), 'quiz_levels', ['id'], unique=False)

    # Create company_questions table
    op.create_table(
        'company_questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('level_id', sa.Integer(), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('options', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('correct_answer', sa.String(length=500), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('source', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['level_id'], ['quiz_levels.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_company_questions_company_id'), 'company_questions', ['company_id'], unique=False)
    op.create_index(op.f('ix_company_questions_created_at'), 'company_questions', ['created_at'], unique=False)
    op.create_index(op.f('ix_company_questions_id'), 'company_questions', ['id'], unique=False)
    op.create_index(op.f('ix_company_questions_level_id'), 'company_questions', ['level_id'], unique=False)

    # Create quiz_sessions table
    op.create_table(
        'quiz_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('level_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('score', sa.Integer(), nullable=True),
        sa.Column('total_questions', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['level_id'], ['quiz_levels.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_sessions_company_id'), 'quiz_sessions', ['company_id'], unique=False)
    op.create_index(op.f('ix_quiz_sessions_id'), 'quiz_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_quiz_sessions_level_id'), 'quiz_sessions', ['level_id'], unique=False)
    op.create_index(op.f('ix_quiz_sessions_started_at'), 'quiz_sessions', ['started_at'], unique=False)
    op.create_index(op.f('ix_quiz_sessions_user_id'), 'quiz_sessions', ['user_id'], unique=False)

    # Create session_answers table
    op.create_table(
        'session_answers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('selected_answer', sa.String(length=500), nullable=True),
        sa.Column('is_correct', sa.Integer(), nullable=True),
        sa.Column('answered_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['company_questions.id'], ),
        sa.ForeignKeyConstraint(['session_id'], ['quiz_sessions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_session_answers_id'), 'session_answers', ['id'], unique=False)
    op.create_index(op.f('ix_session_answers_question_id'), 'session_answers', ['question_id'], unique=False)
    op.create_index(op.f('ix_session_answers_session_id'), 'session_answers', ['session_id'], unique=False)


def downgrade():
    # Drop tables in reverse order
    op.drop_index(op.f('ix_session_answers_session_id'), table_name='session_answers')
    op.drop_index(op.f('ix_session_answers_question_id'), table_name='session_answers')
    op.drop_index(op.f('ix_session_answers_id'), table_name='session_answers')
    op.drop_table('session_answers')
    
    op.drop_index(op.f('ix_quiz_sessions_user_id'), table_name='quiz_sessions')
    op.drop_index(op.f('ix_quiz_sessions_started_at'), table_name='quiz_sessions')
    op.drop_index(op.f('ix_quiz_sessions_level_id'), table_name='quiz_sessions')
    op.drop_index(op.f('ix_quiz_sessions_id'), table_name='quiz_sessions')
    op.drop_index(op.f('ix_quiz_sessions_company_id'), table_name='quiz_sessions')
    op.drop_table('quiz_sessions')
    
    op.drop_index(op.f('ix_company_questions_level_id'), table_name='company_questions')
    op.drop_index(op.f('ix_company_questions_id'), table_name='company_questions')
    op.drop_index(op.f('ix_company_questions_created_at'), table_name='company_questions')
    op.drop_index(op.f('ix_company_questions_company_id'), table_name='company_questions')
    op.drop_table('company_questions')
    
    op.drop_index(op.f('ix_quiz_levels_id'), table_name='quiz_levels')
    op.drop_table('quiz_levels')
    
    op.drop_index(op.f('ix_companies_name'), table_name='companies')
    op.drop_index(op.f('ix_companies_id'), table_name='companies')
    op.drop_table('companies')
    
    # Drop enum type
    sa.Enum('EASY', 'MEDIUM', 'HARD', name='difficultylevel').drop(op.get_bind())
