import hashlib
import bcrypt


def _prehash(password: str) -> bytes:
    # SHA-256 hex digest is 64 chars => 64 bytes when encoded; safe for bcrypt
    return hashlib.sha256(password.encode()).hexdigest().encode()


def hash_password(password: str) -> str:
    pre = _prehash(password)
    hashed = bcrypt.hashpw(pre, bcrypt.gensalt())
    return hashed.decode()


def verify_password(password: str, hashed_password: str) -> bool:
    pre = _prehash(password)
    try:
        return bcrypt.checkpw(pre, hashed_password.encode())
    except ValueError:
        return False