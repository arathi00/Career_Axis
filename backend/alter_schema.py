from sqlalchemy import create_engine, text
from app.database.session import SessionLocal
import traceback
import sys

db = SessionLocal()
try:
    # ALTER table columns to JSONB type safely with USING clause
    commands = [
        "ALTER TABLE resumes ALTER COLUMN certifications TYPE JSONB USING certifications::text::jsonb;",
        "ALTER TABLE resumes ALTER COLUMN achievements TYPE JSONB USING achievements::text::jsonb;",
        "ALTER TABLE resumes ALTER COLUMN languages TYPE JSONB USING languages::text::jsonb;",
        "ALTER TABLE resumes ALTER COLUMN technical_skills TYPE JSONB USING technical_skills::text::jsonb;",
        "ALTER TABLE resumes ALTER COLUMN tools TYPE JSONB USING tools::text::jsonb;"
    ]
    for cmd in commands:
        db.execute(text(cmd))
    db.commit()
    print('Successfully altered database schema.')
except Exception as e:
    db.rollback()
    print('Error altering schema:')
    traceback.print_exc(file=sys.stdout)
finally:
    db.close()
