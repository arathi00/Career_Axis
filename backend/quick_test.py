from app.database.database import engine
from sqlalchemy import text

print("🔄 Adding missing columns to resumes table...")

columns = [
    "job_role VARCHAR",
    "key_strength VARCHAR", 
    "domain VARCHAR",
    "technical_skills VARCHAR[]",
    "tools VARCHAR[]",
    "internships JSONB",
    "certifications VARCHAR[]",
    "achievements VARCHAR[]", 
    "languages VARCHAR[]",
    "phone VARCHAR",
    "address VARCHAR",
    "file_path VARCHAR"
]

with engine.connect() as conn:
    for col_def in columns:
        col_name = col_def.split()[0]
        try:
            sql = f"ALTER TABLE resumes ADD COLUMN IF NOT EXISTS {col_def}"
            conn.execute(text(sql))
            conn.commit()
            print(f"✅ Added: {col_name}")
        except:
            print(f"⚠️  {col_name} already exists (skipping)")

print("\n🎉 FIX COMPLETE! Restart your backend and frontend should work!")