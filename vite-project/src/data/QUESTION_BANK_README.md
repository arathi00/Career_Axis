# Question Bank System Documentation

## 📁 File Structure

```
src/data/
├── questions/                          # JSON question files
│   ├── tcs-aptitude.json              # TCS Aptitude questions
│   ├── tcs-logical.json               # TCS Logical questions
│   ├── tcs-verbal.json                # TCS Verbal questions
│   ├── tcs-technical-cse.json         # TCS Technical (CSE) questions
│   ├── infosys-aptitude.json          # Add more companies...
│   └── ...
└── questionBankLoader.js              # Question loader utility

backend/
└── generate_questions.py              # Python script to auto-generate questions
```

## 📋 Standard JSON Schema

Every question file follows this structure:

```json
{
  "company": "TCS",
  "college": "GECI",
  "section": "Aptitude | Logical | Verbal | Technical",
  "branch": "ALL | CSE | MECH | ECE | EEE",
  "total_questions": 100,
  "questions": [
    {
      "id": "APT_001",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "difficulty": "easy | medium | hard",
      "source": "manual | ai"
    }
  ]
}
```

## 🔧 Field Descriptions

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `company` | String | Company name | TCS, Infosys, Wipro, etc. |
| `college` | String | College name | GECI or any college |
| `section` | String | Question category | Aptitude, Logical, Verbal, Technical |
| `branch` | String | Engineering branch | ALL, CSE, MECH, ECE, EEE |
| `total_questions` | Number | Total count | Any positive number |
| `id` | String | Unique question ID | APT_001, LOG_042, etc. |
| `question` | String | Question text | Any valid question |
| `options` | Array | 4 answer choices | String array [A, B, C, D] |
| `answer` | String | Correct answer | Must match one option |
| `difficulty` | String | Difficulty level | easy, medium, hard |
| `source` | String | Question origin | manual, ai |

## 🚀 Usage Examples

### 1️⃣ Loading Questions in Frontend

```javascript
import { getQuestionsByCompany, getRandomQuestions } from '@/data/questionBankLoader';

// Get all aptitude questions for TCS
const questions = getQuestionsByCompany("TCS", "Aptitude");

// Get 10 random easy questions
const easyQuestions = getRandomQuestions("TCS", "Aptitude", 10, "easy");

// Get only medium difficulty questions
const mediumQuestions = getQuestionsByCompany("TCS", "Aptitude", "ALL", "medium");
```

### 2️⃣ Getting Statistics

```javascript
import { getQuestionStats } from '@/data/questionBankLoader';

const stats = getQuestionStats("TCS", "Aptitude");
console.log(stats);
// Output: { total: 10, easy: 5, medium: 3, hard: 2, manual: 5, ai: 5 }
```

### 3️⃣ Converting to Legacy Format

```javascript
import { getLegacyQuiz } from '@/data/questionBankLoader';

// Get quiz in the old format for backward compatibility
const quiz = getLegacyQuiz("TCS", "Aptitude", "easy");
```

## 🐍 Generating Questions with Python

### Basic Usage

```bash
cd backend
python generate_questions.py
```

### Generate for Specific Company/Section

```python
from generate_questions import save_question_file

# Generate 100 aptitude questions for TCS
save_question_file("TCS", "Aptitude", "ALL", 100, "./questions")

# Generate 50 technical questions for CSE branch
save_question_file("Infosys", "Technical", "CSE", 50, "./questions")
```

### Generate All Sections for a Company

```python
from generate_questions import generate_all_company_questions

# Generate all question sets for TCS
generate_all_company_questions("TCS", 100)
```

### Bulk Generation for Multiple Companies

```python
from generate_questions import generate_all_company_questions

companies = ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture"]

for company in companies:
    generate_all_company_questions(company, 100)
```

## 📦 Adding New Company Questions

### Step 1: Create JSON Files

Create question files for each section:
- `{company}-aptitude.json`
- `{company}-logical.json`
- `{company}-verbal.json`
- `{company}-technical-cse.json`

### Step 2: Update questionBankLoader.js

```javascript
// Add import
import infosysAptitude from './questions/infosys-aptitude.json';

// Add to registry
const questionBanks = {
  'TCS': { /* existing */ },
  'Infosys': {
    'Aptitude': infosysAptitude,
    // Add more sections...
  }
};
```

### Step 3: Use Python Script (Recommended)

```python
# Generate all files automatically
from generate_questions import generate_all_company_questions

generate_all_company_questions("Infosys", 100)
```

## 📊 Question Distribution Guidelines

For 100 questions per section:
- **Easy**: 40 questions (40%)
- **Medium**: 40 questions (40%)
- **Hard**: 20 questions (20%)

## 🎯 Best Practices

1. **Unique IDs**: Use consistent prefixes (APT_, LOG_, VER_, CSE_)
2. **Quality**: Mix manual and AI-generated questions
3. **Difficulty**: Maintain proper distribution
4. **Options**: Always provide exactly 4 options
5. **Answer**: Must match one of the options exactly
6. **Branch**: Use "ALL" for general, specific branch for technical

## 🔄 Migration from Legacy Format

The system supports backward compatibility. Legacy format:

```javascript
{
  q: "Question text",
  options: ["A", "B", "C", "D"],
  answer: 1,  // Index of correct answer
  explanation: "Explanation text"
}
```

Use `convertToLegacyFormat()` or `getLegacyQuiz()` to convert.

## 📝 Example: Complete Workflow

```bash
# 1. Generate questions
cd backend
python generate_questions.py

# 2. Move generated files to frontend
mv ./questions/*.json ../vite-project/src/data/questions/

# 3. Update questionBankLoader.js to include new files

# 4. Use in components
import { getQuestionsByCompany } from '@/data/questionBankLoader';
const questions = getQuestionsByCompany("TCS", "Aptitude");
```

## 🐛 Troubleshooting

**Issue**: Questions not loading
- ✅ Check JSON file syntax
- ✅ Verify import in questionBankLoader.js
- ✅ Ensure company name matches exactly

**Issue**: Wrong answer format
- ✅ Answer must be exact string match from options
- ✅ Not an index number (use converter for legacy)

**Issue**: Missing questions
- ✅ Check total_questions matches array length
- ✅ Verify filter parameters (difficulty, branch)

## 📞 Support

For questions or issues:
1. Check JSON schema compliance
2. Verify file imports
3. Test with provided examples
4. Review console warnings

---

**Last Updated**: January 22, 2026  
**Version**: 1.0.0
