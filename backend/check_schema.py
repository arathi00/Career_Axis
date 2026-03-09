from app.database.database import engine
from sqlalchemy import inspect
inspector = inspect(engine)
if 'questions' in inspector.get_table_names():
    cols = [c['name'] for c in inspector.get_columns('questions')]
    print('Questions table columns:', cols)
    if 'quiz_id' in cols:
        print('[OK] quiz_id column EXISTS')
    else:
        print('[ERROR] quiz_id column MISSING')
else:
    print('[ERROR] No questions table')
