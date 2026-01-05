from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # passlib expects a text string; trim and limit to 72 chars (bcrypt limit)
    pw = password.strip()
    if len(pw) > 72:
        pw = pw[:72]
    return pwd_context.hash(pw)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pw = plain_password.strip()
    if len(pw) > 72:
        pw = pw[:72]
    return pwd_context.verify(pw, hashed_password)
