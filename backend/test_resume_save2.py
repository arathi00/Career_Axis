import requests
import json
import random
import string

email = 'test_' + ''.join(random.choices(string.ascii_lowercase, k=4)) + '@example.com'
password = 'Password123'

# Register
reg_data = {
    'name': 'Test User',
    'email': email,
    'password': password,
    'university': 'Test Uni',
    'college': 'Test College',
    'course': 'Test Course',
    'branch': 'CS',
    'currentYear': '4',
    'graduationYear': 2024,
    'cgpa': 8.5,
    'skills': ['Python']
}
requests.post('http://127.0.0.1:8000/auth/register', json=reg_data)

# Login
login_data = {'email': email, 'password': password}
r = requests.post('http://127.0.0.1:8000/auth/login', json=login_data)
if r.status_code != 200:
    print('Login failed:', r.text)
    exit(1)

token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# Try saving resume data exactly as frontend sends it
resumeData = {
    "name": "Test User",
    "email": email,
    "phone": "9999999999",
    "summary": "Full stack developer",
    "skills": "React, Node.js",
    "technical_skills": ["React", "Node.js"],
    "education": [{"school": "Test", "branch": "CS", "cgpa": "9", "year": "2024"}],
    "projects": [{"title": "Test", "technologies": "React", "description": "Test doc", "github": ""}],
    "certifications": [{"name": "AWS", "organization": "Amazon", "year": "2023"}],
    "achievements": [],
    "tools": [],
    "languages": [],
    "internships": []
}

try:
    r2 = requests.post('http://127.0.0.1:8000/resume/', headers=headers, json=resumeData)
    print('Response 1:', r2.status_code, r2.text)

    if r2.status_code == 422:
        r3 = requests.post('http://127.0.0.1:8000/resume/', headers=headers, json={"resume": resumeData})
        print('Response 2:', r3.status_code, r3.text)
except Exception as e:
    print('Error making request:', e)

