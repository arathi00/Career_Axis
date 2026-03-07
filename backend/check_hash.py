from app.core.security import hash_password, verify_password
from app.models.user import User
from app.database.session import SessionLocal

db = SessionLocal()
user = db.query(User).filter(User.email == 'arun@gmail.com').first()
if user:
    print(f'Hash in DB: {user.password_hash}')
    print(f'Hash of arun@123: {hash_password("arun@123")}')
    print(f'Try verify with arun@123: {verify_password("arun@123", user.password_hash)}')
    print(f'Try verify with password: {verify_password("password", user.password_hash)}')
    print(f'Try verify with Password: {verify_password("Password", user.password_hash)}')
    print(f'Try verify with Password123: {verify_password("Password123", user.password_hash)}')
    print(f'Try verify with 12345678: {verify_password("12345678", user.password_hash)}')
    print(f'Try verify with arun: {verify_password("arun", user.password_hash)}')
    print(f'Try verify with arun123: {verify_password("arun123", user.password_hash)}')
    print(f'Try verify with arun@123: {verify_password("arun@123", user.password_hash)}')
    print(f'Try verify with 123456: {verify_password("123456", user.password_hash)}')
    print(f'Try verify with \": {verify_password("", user.password_hash)}')
else:
    print('User not found')
