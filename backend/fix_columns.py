from app.database.database import engine
from sqlalchemy import text

print("=== FIXING DATABASE COLUMNS ===")

# These are the missing columns causing the error
sql_commands = [
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS job_role VARCHAR",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS key_strength VARCHAR",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS domain VARCHAR",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS technical_skills VARCHAR[]",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS tools VARCHAR[]",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS internships JSONB",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS certifications VARCHAR[]",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS achievements VARCHAR[]",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS languages VARCHAR[]",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone VARCHAR",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS address VARCHAR",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS file_path VARCHAR"
]

with engine.connect() as conn:
    for sql in sql_commands:
        try:
            conn.execute(text(sql))
            conn.commit()
            print(f"✓ {sql}")
        except Exception as e:
            print(f"✗ Error: {e}")

print("\n✅ COLUMNS ADDED! Now restart your backend.")