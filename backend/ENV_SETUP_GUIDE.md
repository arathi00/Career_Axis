# Environment Configuration Template for Company Quiz System

Copy this to `.env` file in the backend directory and fill in your values.

```env
# ===============================================
# DATABASE CONFIGURATION
# ===============================================
DATABASE_URL=postgresql://postgres:root123@localhost:5432/career_axis

# ===============================================
# JWT/SECURITY CONFIGURATION
# ===============================================
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# ===============================================
# AI SERVICES
# ===============================================

# OpenAI API Key (for other features)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE

# Google Gemini API Key (FOR COMPANY QUIZ SYSTEM)
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA

# ===============================================
# OPTIONAL CONFIGURATIONS
# ===============================================

# Application name
PROJECT_NAME=Career Axis

# Environment (development, production, testing)
ENVIRONMENT=development

# Debug mode
DEBUG=True

# CORS allowed origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# ===============================================
# GEMINI API RATE LIMITING (Optional)
# ===============================================

# Rate limit for Gemini API calls (per minute)
GEMINI_RATE_LIMIT=60

# Batch size for question generation
GEMINI_BATCH_SIZE=10
```

## 🔑 How to Get API Keys

### 1. Google Gemini API Key

**Step 1:** Go to https://makersuite.google.com/app/apikey

**Step 2:** Click "Create API Key"

**Step 3:** Select your Google Project (or create new)

**Step 4:** Copy the API key

**Step 5:** Paste into `.env`:
```env
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA
```

**Step 6:** Verify it works:
```bash
python -c "import google.generativeai as genai; genai.configure(api_key='YOUR_KEY'); print('✅ Gemini API configured successfully')"
```

### 2. OpenAI API Key (Optional)

**Step 1:** Go to https://platform.openai.com/api-keys

**Step 2:** Create new API key

**Step 3:** Copy and paste into `.env`:
```env
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

### 3. PostgreSQL Database

**Local Setup:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
```

**Remote Setup (e.g., RDS):**
```env
DATABASE_URL=postgresql://user:pass@db-instance.amazonaws.com:5432/career_axis
```

### 4. JWT Secret Key

Generate a strong secret:
```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Using OpenSSL
openssl rand -base64 32
```

Then copy to `.env`:
```env
SECRET_KEY=your_generated_secret_here
```

## 🚀 Environment Setup Steps

### Step 1: Create `.env` file
```bash
cd backend
touch .env
```

### Step 2: Copy template to `.env`
```bash
# Copy the content above into .env
nano .env
```

### Step 3: Fill in your values
- `DATABASE_URL` - Your PostgreSQL connection
- `GEMINI_API_KEY` - Your Google API key
- `SECRET_KEY` - Generate a secure key
- Rest are optional (defaults provided)

### Step 4: Verify configuration
```bash
python -c "from app.core.config import settings; print('✅ Config loaded successfully'); print(f'DB: {settings.DATABASE_URL[:20]}...'); print(f'Gemini Key: {settings.GEMINI_API_KEY[:10]}...')"
```

## 📋 Configuration Checklist

- [ ] Created `.env` file in `backend/` directory
- [ ] Added `DATABASE_URL` with correct PostgreSQL connection
- [ ] Got Gemini API key from Google AI Studio
- [ ] Added `GEMINI_API_KEY` to `.env`
- [ ] Generated strong `SECRET_KEY`
- [ ] Set `ALGORITHM=HS256`
- [ ] Set `ACCESS_TOKEN_EXPIRE_MINUTES=60`
- [ ] (Optional) Added `OPENAI_API_KEY`
- [ ] Verified configuration loads without errors
- [ ] Started backend successfully

## ⚠️ Important Notes

1. **Never commit `.env` to Git**
   - Add to `.gitignore`:
   ```
   .env
   .env.local
   .env.*.local
   ```

2. **Keep API Keys Secret**
   - Don't share in Slack/Email
   - Rotate keys periodically
   - Use different keys for dev/prod

3. **Production Settings**
   ```env
   ENVIRONMENT=production
   DEBUG=False
   SECRET_KEY=use_strong_random_key
   ```

4. **Database Security**
   - Use strong password (not root123)
   - Use encrypted connections (SSL)
   - Restrict IP access

5. **Rate Limiting**
   - Gemini: 60 requests/minute free tier
   - Implement caching to reduce calls
   - Monitor usage in Google Cloud Console

## 🔄 Environment Variables Used by Code

### In `app/core/config.py`
```python
from app.core.config import settings

# Access anywhere in your code
settings.DATABASE_URL
settings.GEMINI_API_KEY
settings.OPENAI_API_KEY
settings.SECRET_KEY
settings.ALGORITHM
settings.ACCESS_TOKEN_EXPIRE_MINUTES
```

### In `app/services/gemini_service.py`
```python
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
```

## 🐛 Debugging Configuration

### Test Database Connection
```bash
python -c "
from sqlalchemy import create_engine
from app.core.config import settings
engine = create_engine(settings.DATABASE_URL)
with engine.connect() as conn:
    print('✅ Database connected successfully')
"
```

### Test Gemini API
```bash
python -c "
import google.generativeai as genai
from app.core.config import settings
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content('Say hello')
print('✅ Gemini API working')
print(response.text)
"
```

### Test JWT Configuration
```bash
python -c "
from app.core.config import settings
print(f'Secret Key: {settings.SECRET_KEY[:10]}...')
print(f'Algorithm: {settings.ALGORITHM}')
print(f'Token Expire: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes')
"
```

## 📝 Sample Development Configuration

```env
# Development setup
DATABASE_URL=postgresql://postgres:password@localhost:5432/career_axis_dev
SECRET_KEY=dev-secret-key-not-for-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA
ENVIRONMENT=development
DEBUG=True
```

## 📝 Sample Production Configuration

```env
# Production setup (DO NOT USE HARDCODED VALUES)
DATABASE_URL=postgresql://prod_user:strong_password@prod-db.example.com:5432/career_axis
SECRET_KEY=use_secrets_manager_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA
ENVIRONMENT=production
DEBUG=False
```

## 🔐 Using AWS Secrets Manager (Production)

```python
# Instead of reading from .env
import boto3

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    return client.get_secret_value(SecretId=secret_name)['SecretString']

# Then in config:
GEMINI_API_KEY = get_secret('career-axis/gemini-key')
```

## ✅ Ready to Go!

Once your `.env` is configured, you're ready to:

1. Run migrations: `alembic upgrade head`
2. Start backend: `uvicorn main:app --reload`
3. Test endpoints: `http://localhost:8000/docs`
4. Deploy frontend components

**Happy coding! 🚀**
