"""fix_resume_jsonb_columns

Revision ID: fix_resume_jsonb
Revises: f1e2d3c4b5a6
Create Date: 2024-03-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'fix_resume_jsonb'
down_revision = 'f1e2d3c4b5a6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop any NOT NULL constraints first
    op.alter_column('resumes', 'technical_skills', nullable=True)
    op.alter_column('resumes', 'tools', nullable=True)
    op.alter_column('resumes', 'internships', nullable=True)
    op.alter_column('resumes', 'certifications', nullable=True)
    op.alter_column('resumes', 'achievements', nullable=True)
    op.alter_column('resumes', 'languages', nullable=True)
    
    # Alter columns to JSONB type
    op.execute("ALTER TABLE resumes ALTER COLUMN technical_skills TYPE jsonb USING COALESCE(to_jsonb(technical_skills), '[]'::jsonb)")
    op.execute("ALTER TABLE resumes ALTER COLUMN tools TYPE jsonb USING COALESCE(to_jsonb(tools), '[]'::jsonb)")
    op.execute("ALTER TABLE resumes ALTER COLUMN internships TYPE jsonb USING COALESCE(internships::text::jsonb, '[]'::jsonb)")
    op.execute("ALTER TABLE resumes ALTER COLUMN certifications TYPE jsonb USING COALESCE(certifications::text::jsonb, '[]'::jsonb)")
    op.execute("ALTER TABLE resumes ALTER COLUMN achievements TYPE jsonb USING COALESCE(achievements::text::jsonb, '[]'::jsonb)")
    op.execute("ALTER TABLE resumes ALTER COLUMN languages TYPE jsonb USING COALESCE(to_jsonb(languages), '[]'::jsonb)")


def downgrade() -> None:
    # Downgrade back to ARRAY type (for safety)
    op.execute("ALTER TABLE resumes ALTER COLUMN technical_skills TYPE character varying[] USING ARRAY[technical_skills::text]")
    op.execute("ALTER TABLE resumes ALTER COLUMN tools TYPE character varying[] USING ARRAY[tools::text]")
    op.execute("ALTER TABLE resumes ALTER COLUMN internships TYPE character varying[] USING ARRAY[internships::text]")
    op.execute("ALTER TABLE resumes ALTER COLUMN certifications TYPE character varying[] USING ARRAY[certifications::text]")
    op.execute("ALTER TABLE resumes ALTER COLUMN achievements TYPE character varying[] USING ARRAY[achievements::text]")
    op.execute("ALTER TABLE resumes ALTER COLUMN languages TYPE character varying[] USING ARRAY[languages::text]")
