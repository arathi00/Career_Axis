from app.core.security import hash_password
from app.models.user import User
from app.database.session import SessionLocal

db = SessionLocal()
user = db.query(User).filter(User.email == 'arun@gmail.com').first()
if user:
    new_hash = hash_password('Password123')
    user.password_hash = new_hash
    db.commit()
    print('User arun@gmail.com password reset to Password123')
else:
    print('User not found')
