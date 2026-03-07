import requests
import json

# 1. Login to get token
login_data = {'email': 'arun@gmail.com', 'password': 'Password123'}
r = requests.post('http://127.0.0.1:8000/auth/login', json=login_data)
if r.status_code != 200:
    print('Login failed:', r.text)
    exit(1)

token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# 2. Try saving resume data exactly as frontend sends it
resumeData = {
    "name": "Arun",
    "email": "arun@gmail.com",
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

r2 = requests.post('http://127.0.0.1:8000/resume/', headers=headers, json=resumeData)
print('Response 1:', r2.status_code, r2.text)

if r2.status_code == 422:
    r3 = requests.post('http://127.0.0.1:8000/resume/', headers=headers, json={"resume": resumeData})
    print('Response 2:', r3.status_code, r3.text)
