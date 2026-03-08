# Question Bank API Documentation

## Overview
The Question Bank system validates quiz generation requests against predefined company question limits and automatically uses AI only when database questions are insufficient.

## Configuration Structure

### JSON Configuration (`app/config/question_bank.json`)
```json
{
  "companies": [
    {
      "company_name": "TCS",
      "track": "Software Engineer",
      "exam_types": {
        "Technical": [
          { "category": "Arrays", "total_questions": 15 },
          { "category": "Strings", "total_questions": 20 }
        ],
        "Aptitude": [
          { "category": "Aptitude", "total_questions": 30 }
        ]
      }
    }
  ]
}
```

## API Endpoints

### 1. Get All Companies
```http
GET /quizzes/companies
```

**Response:**
```json
{
  "companies": [
    { "company_name": "TCS", "track": "Software Engineer" },
    { "company_name": "Infosys", "track": "Software Engineer" }
  ]
}
```

### 2. Get Exam Types for Company
```http
GET /quizzes/companies/{company_name}/exam-types
```

**Example:** `GET /quizzes/companies/TCS/exam-types`

**Response:**
```json
{
  "company": "TCS",
  "exam_types": ["Technical", "Aptitude"]
}
```

### 3. Get Categories for Company
```http
GET /quizzes/companies/{company_name}/categories?exam_type={exam_type}
```

**Parameters:**
- `exam_type` (optional): Filter by exam type

**Example:** `GET /quizzes/companies/TCS/categories?exam_type=Technical`

**Response:**
```json
{
  "company": "TCS",
  "exam_type": "Technical",
  "categories": [
    { "category": "Arrays", "total_questions": 15, "exam_type": "Technical" },
    { "category": "Strings", "total_questions": 20, "exam_type": "Technical" }
  ]
}
```

### 4. Get Available Topics
```http
GET /quizzes/companies/{company_name}/topics?track={track}&exam_type={exam_type}&category={category}
```

**Parameters:**
- `track`: Track name (e.g., "Software Engineer")
- `exam_type`: Exam type
- `category`: Category name

**Example:** `GET /quizzes/companies/TCS/topics?track=Software%20Engineer&exam_type=Technical&category=Arrays`

**Response:**
```json
{
  "company": "TCS",
  "track": "Software Engineer",
  "exam_type": "Technical",
  "category": "Arrays",
  "topics": [
    { "topic": "Binary Search", "count": 5 },
    { "topic": "Sorting Algorithms", "count": 8 }
  ]
}
```

### 5. Generate AI Quiz (with Validation)
```http
POST /quizzes/ai-generate
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "company": "TCS",
  "track": "Software Engineer",
  "exam_type": "Technical",
  "category": "Arrays",
  "topic": "Binary Search",
  "difficulty": "Medium",
  "num_questions": 10
}
```

**Validation Rules:**
1. ✅ Company must exist in question bank
2. ✅ Exam type must be valid for company
3. ✅ Category must exist with sufficient total_questions
4. ✅ Requested num_questions ≤ configured total_questions
5. ✅ AI generates only if DB count < num_questions

**Response (Success):**
```json
{
  "quiz_id": 123,
  "message": "Quiz generated successfully",
  "num_questions": 10
}
```

**Response (Validation Error):**
```json
{
  "detail": "Requested 25 questions but only 15 available for Arrays"
}
```

### 6. Get Question Bank Statistics (Admin Only)
```http
GET /quizzes/stats
```

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "total_companies": 11,
  "total_configured_questions": 1265,
  "total_questions_in_db": 847,
  "overall_completion": 66.95,
  "company_stats": [
    {
      "company": "TCS",
      "track": "Software Engineer",
      "configured": 110,
      "in_database": 78,
      "completion_percentage": 70.91
    }
  ]
}
```

## Question Bank Service

### Class: `QuestionBankService`

#### `get_all_companies() → List[Dict]`
Returns list of all companies with tracks.

#### `get_company_config(company_name: str) → Dict`
Gets full configuration for a company.

#### `get_exam_types(company_name: str) → List[str]`
Gets available exam types for company.

#### `get_categories(company_name: str, exam_type: str) → List[Dict]`
Gets categories with limits for company/exam type.

#### `get_max_questions(company_name: str, category: str) → int`
Gets maximum questions available for category.

#### `validate_quiz_request(...) → Dict`
Validates quiz generation request.

**Returns:**
```python
{
    "valid": bool,
    "message": str,
    "max_available": int,
    "db_count": int,
    "needs_ai": bool,
    "ai_generate_count": int
}
```

#### `get_available_topics(...) → List[Dict]`
Gets topics that have questions in database.

#### `get_question_bank_stats(db: Session) → Dict`
Gets comprehensive statistics about question bank.

## AI Generation Logic

### Flow:
1. **Validation**: Check request against question bank limits
2. **DB Check**: Query existing questions for topic
3. **Decision**: 
   - If DB has enough questions → Use DB questions
   - If DB has insufficient → Generate missing count via AI
4. **Storage**: Save new questions to database
5. **Association**: Link questions to quiz

### Example Scenario:
- **Request**: 10 questions on "Arrays"
- **Configured Limit**: 15 questions max
- **DB Count**: 6 questions
- **Action**: Use 6 from DB + Generate 4 via AI

## Frontend Integration

### 1. Load Companies
```javascript
import { getCompanies } from '../api/quizApi';

const companies = await getCompanies();
// [{ company_name: "TCS", track: "Software Engineer" }, ...]
```

### 2. Load Exam Types
```javascript
const examTypes = await getExamTypes("TCS");
// ["Technical", "Aptitude"]
```

### 3. Load Categories
```javascript
const categories = await getCompanyCategories("TCS", "Technical");
// [{ category: "Arrays", total_questions: 15, exam_type: "Technical" }, ...]
```

### 4. Generate Quiz
```javascript
const result = await generateAIQuiz({
  company: "TCS",
  track: "Software Engineer",
  exam_type: "Technical",
  category: "Arrays",
  topic: "Binary Search",
  difficulty: "Medium",
  num_questions: 10
});
// { quiz_id: 123, message: "...", num_questions: 10 }
```

### 5. View Statistics (Admin)
```javascript
const stats = await getQuestionBankStats();
// { total_companies: 11, total_configured_questions: 1265, ... }
```

## Question Bank Configuration

### Companies Included:
1. **TCS** - Software Engineer (110 questions)
2. **Infosys** - Software Engineer (105 questions)
3. **Wipro** - Software Engineer (105 questions)
4. **Accenture** - Software Engineer (115 questions)
5. **Cognizant** - Software Engineer (110 questions)
6. **Capgemini** - Software Engineer (100 questions)
7. **HCL** - Software Engineer (95 questions)
8. **Tech Mahindra** - Software Engineer (100 questions)
9. **Bosch** - Mechanical Engineer (120 questions)
10. **L&T** - Mechanical Engineer (110 questions)
11. **Siemens** - Electrical Engineer (100 questions)

**Total Configured: 1,265 questions**

## Error Handling

### Common Errors:
1. **Company Not Found**
   ```json
   { "detail": "Company 'XYZ' not found in question bank" }
   ```

2. **Invalid Exam Type**
   ```json
   { "detail": "Exam type 'Quiz' not available for TCS" }
   ```

3. **Exceeds Question Limit**
   ```json
   { "detail": "Requested 25 questions but only 15 available for Arrays" }
   ```

4. **Category Not Found**
   ```json
   { "detail": "Category 'Graphs' not found for TCS" }
   ```

## Best Practices

1. **Always validate before generation**: Check available question counts
2. **Show limits to users**: Display total_questions in UI
3. **Handle partial data**: Some topics may have 0 questions in DB initially
4. **Use statistics endpoint**: Monitor question bank completion
5. **Respect configured limits**: Never request more than total_questions

## Testing Endpoints

### Test Company List:
```bash
curl http://localhost:8000/quizzes/companies
```

### Test Exam Types:
```bash
curl http://localhost:8000/quizzes/companies/TCS/exam-types
```

### Test Categories:
```bash
curl "http://localhost:8000/quizzes/companies/TCS/categories?exam_type=Technical"
```

### Test Quiz Generation:
```bash
curl -X POST http://localhost:8000/quizzes/ai-generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "TCS",
    "track": "Software Engineer",
    "exam_type": "Technical",
    "category": "Arrays",
    "topic": "Binary Search",
    "difficulty": "Medium",
    "num_questions": 5
  }'
```

### Test Statistics:
```bash
curl http://localhost:8000/quizzes/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Migration

Run the database migration to create question bank tables:
```bash
cd backend
alembic upgrade head
```

## Summary

✅ **Validation**: Prevents requesting more questions than available
✅ **AI Control**: AI generates only when DB count < required
✅ **Frontend Sync**: Dropdowns auto-populate from config
✅ **Statistics**: Track question bank completion
✅ **Scalable**: Easy to add new companies/categories via JSON
