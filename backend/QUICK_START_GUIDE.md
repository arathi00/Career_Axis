# ⚡ Quick Start Guide - Company Quiz System

## 🎯 What You're Getting

A complete placement test system that:
- ✅ Stores questions by company (TCS, Infosys, etc.)
- ✅ Categorizes by difficulty (Easy, Medium, Hard)
- ✅ **Generates questions dynamically using Gemini API**
- ✅ **Caches questions in database** (no redundant API calls)
- ✅ Tracks user scores and history
- ✅ Provides detailed answer explanations

## 📦 Files Created/Modified

### Backend Files

**New Models:**
- `app/models/company_quiz.py` - Database models (Company, QuizLevel, CompanyQuestion, QuizSession, SessionAnswer)

**New Services:**
- `app/services/gemini_service.py` - Gemini API integration for question generation

**New Schemas:**
- `app/schemas/company_quiz.py` - Pydantic validation schemas

**New Router:**
- `app/routers/company_quiz.py` - API endpoints (start quiz, submit, history)

**New Migration:**
- `alembic/versions/add_company_quiz_tables.py` - Database schema creation

**Updated Files:**
- `app/core/config.py` - Added GEMINI_API_KEY
- `main.py` - Registered company_quiz router
- `requirements.txt` - Added google-generativeai, alembic

### Frontend Files

**New API Layer:**
- `src/api/companyQuizApi.js` - API calls and React hooks

**New Components:**
- `src/components/CompanyQuiz.jsx` - Complete UI component
- `src/components/CompanyQuiz.css` - Styling

**Documentation:**
- `COMPANY_QUIZ_DOCUMENTATION.md` - Full API reference
- `QUICK_START_GUIDE.md` - This file

## 🚀 Setup in 5 Minutes

### Step 1: Get Gemini API Key (1 minute)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key" 
3. Copy the key

### Step 2: Update Environment (1 minute)

Edit `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA
```

### Step 3: Install Dependencies (2 minute)

```bash
cd backend
pip install google-generativeai
```

### Step 4: Run Migrations (1 minute)

```bash
cd backend
alembic upgrade head
```

If you get an error, manually create tables:
```bash
python -c "from app.database.base import Base; from app.database.database import engine; Base.metadata.create_all(bind=engine)"
```

### Step 5: Start Backend

```bash
cd backend
uvicorn main:app --reload
```

## 🎯 Test It Out

### Option 1: Using Frontend Component

Add to your React component:
```jsx
import CompanyQuiz from './components/CompanyQuiz';

function App() {
  return <CompanyQuiz />;
}
```

### Option 2: Using cURL

**1. Start Quiz:**
```bash
curl -X POST http://localhost:8000/api/company-quiz/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "company": "TCS",
    "level": "easy",
    "count": 5
  }'
```

Response:
```json
{
  "session_id": 1,
  "company": "TCS",
  "level": "easy",
  "total_questions": 5,
  "questions": [
    {
      "id": 1,
      "question_text": "What is time complexity of binary search?",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"]
    }
  ]
}
```

**2. Submit Answers:**
```bash
curl -X POST http://localhost:8000/api/company-quiz/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "session_id": 1,
    "answers": [
      {"question_id": 1, "selected_answer": "O(log n)"},
      {"question_id": 2, "selected_answer": "Option B"}
    ]
  }'
```

Response:
```json
{
  "score": 5,
  "total": 5,
  "percentage": 100.0,
  "answers": [
    {
      "question_text": "...",
      "selected_answer": "O(log n)",
      "correct_answer": "O(log n)",
      "is_correct": true,
      "explanation": "Binary search divides the search space in half..."
    }
  ]
}
```

## 🔄 How It Works (Behind the Scenes)

```
User clicks "Start Quiz" with:
- Company: TCS
- Level: Easy
- Count: 10

↓

Backend checks database:
"Do we have 10+ TCS easy questions?"

↓

Case 1: YES (questions cached)
→ Return questions immediately (~100ms)

↓

Case 2: NO (questions not cached)
→ Call Gemini API with prompt
→ Gemini generates 10 structured questions
→ Parse & validate responses
→ Store in database
→ Return questions to frontend

↓

Frontend displays quiz with timer

↓

User submits answers

↓

Backend evaluates and returns:
- Score
- Percentage
- Answer explanations
- Comparison with correct answers
```

## 🎨 Frontend Component Features

The CompanyQuiz component includes:

✅ **Company & Difficulty Selection**
- Dropdown for company selection
- Buttons for difficulty level
- Question count input

✅ **Quiz Display**
- Progress bar
- Timer (10 minutes)
- Question counter
- Large readable options

✅ **Navigation**
- Previous/Next buttons
- Direct question navigation
- Submit button at the end

✅ **Results View**
- Score with percentage
- All answers review
- Correct vs selected answers
- Answer explanations
- Retry button

✅ **Responsive Design**
- Works on mobile/tablet/desktop
- Touch-friendly buttons
- Optimized layouts

## 📊 Database Schema Quick View

```
┌─────────────────────┐
│   companies         │
├─────────────────────┤
│ id (PK)            │
│ name (TCS, etc)    │
│ description        │
└─────────────────────┘
          ↓
┌─────────────────────┐
│  quiz_levels        │
├─────────────────────┤
│ id (PK)            │
│ company_id (FK)    │
│ level (easy/med/hard)
└─────────────────────┘
          ↓
┌─────────────────────┐
│ company_questions   │
├─────────────────────┤
│ id (PK)            │
│ company_id (FK)    │
│ level_id (FK)      │
│ question_text      │
│ options (JSON)     │
│ correct_answer     │
│ explanation        │
│ source (gemini)    │
└─────────────────────┘
```

## ⚙️ Configuration

### API Rate Limiting

Gemini has rate limits:
- **Free tier**: 60 requests/minute
- **Pro tier**: 300 requests/minute

Strategy: Cache questions to minimize API calls

### Generate Questions Proactively

For popular companies/levels, pre-generate questions:

```python
from app.services.gemini_service import gemini_generator

# Pre-generate 100 questions for TCS Easy
questions = gemini_generator.generate_questions(
    company="TCS",
    difficulty="easy",
    count=100
)
# Store in database
```

### Cost Optimization

- Gemini API is **free** for reasonable usage
- Each question generation costs approximately 0.0005 credits
- Caching eliminates redundant API calls
- Example: 1000 unique questions = ~$0.50

## 🐛 Troubleshooting

### "GEMINI_API_KEY not found"
**Solution**: Add to `.env` file
```env
GEMINI_API_KEY=AIzaSyBTl-l4VCaKndt_qAgCHADwrDouMh9KzYA
```

### "Failed to generate questions"
**Possible causes:**
- API key invalid → Get new key from Google AI Studio
- Rate limited → Wait a minute and retry
- Network error → Check internet connection

### "Table already exists"
**Solution**: Skip migration if tables exist
```bash
# Check migration status
alembic current

# Just create tables
python -c "from app.database.base import Base; from app.database.database import engine; Base.metadata.create_all(bind=engine)"
```

### Questions not showing up
**Check:**
1. Is backend running? `http://localhost:8000/docs`
2. Is authentication working? (Bearer token)
3. Check backend logs for errors
4. Verify Gemini API key is valid

## 📚 Next Steps

1. **Customize question prompts** in `gemini_service.py`
2. **Add more companies** via API or admin panel
3. **Create analytics dashboard** to track performance
4. **Implement adaptive difficulty** based on scores
5. **Add admin panel** for manual question management

## 📞 Need Help?

1. Check `COMPANY_QUIZ_DOCUMENTATION.md` for full API docs
2. Review code comments in model/service files
3. Check Gemini API docs: https://ai.google.dev/
4. Look at example requests in this file

---

**You're all set! Happy testing! 🚀**
