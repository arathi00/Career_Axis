from app.database.database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
columns = inspector.get_columns('resumes')

print("Columns in 'resumes' table:")
for col in columns:
    print(f"  - {col['name']}")

# Check for the problematic column
if any(col['name'] == 'job_role' for col in columns):
    print("\n✅ SUCCESS! job_role column exists!")
else:
    print("\n❌ FAILED! job_role column still missing!")