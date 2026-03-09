import json
import os

def generate_questions(company, section, branch, count=100):
    """
    Generate questions for a specific company, section, and branch
    
    Args:
        company: Company name (e.g., "TCS", "Infosys", "Wipro")
        section: Section name (e.g., "Aptitude", "Logical", "Verbal", "Technical")
        branch: Branch name (e.g., "ALL", "CSE", "MECH", "ECE", "EEE")
        count: Total number of questions to generate (default: 100)
    
    Returns:
        Dictionary with questions structure
    """
    questions = []
    prefix = section[:3].upper()
    
    # Sample question templates for different sections
    templates = {
        "Aptitude": [
            "What is {a} + {b}?",
            "If x = {a}, what is 2x + {b}?",
            "A train travels {a} km in {b} hours. What is its speed?",
            "What is {a}% of {b}?",
            "If the cost price is ₹{a} and profit is {b}%, what is selling price?"
        ],
        "Logical": [
            "What comes next: {a}, {b}, {c}, ?",
            "Find the odd one out in the series",
            "If A is taller than B and B is taller than C, who is shortest?",
            "Complete the pattern: A, C, E, G, ?",
            "Which number doesn't belong: {a}, {b}, {c}, {d}?"
        ],
        "Verbal": [
            "Choose the synonym of '{word}'",
            "What is the antonym of '{word}'?",
            "Identify the grammatically correct sentence",
            "Fill in the blank: She ____ to work every day",
            "What does the idiom 'Break the ice' mean?"
        ],
        "Technical": [
            "What is the time complexity of binary search?",
            "Which data structure follows LIFO principle?",
            "What does {acronym} stand for?",
            "What is the output of: {expression}?",
            "Which is NOT an OOP concept?"
        ]
    }
    
    # Get templates for the section
    section_templates = templates.get(section, templates["Aptitude"])
    
    for i in range(1, count + 1):
        # Determine difficulty
        if i <= count * 0.4:  # 40% easy
            difficulty = "easy"
        elif i <= count * 0.8:  # 40% medium
            difficulty = "medium"
        else:  # 20% hard
            difficulty = "hard"
        
        # Use template or generic question
        question_template = section_templates[i % len(section_templates)]
        
        questions.append({
            "id": f"{prefix}_{i:03}",
            "question": f"Sample {section} question {i}: {question_template}",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Option A",
            "difficulty": difficulty,
            "source": "ai" if i % 2 == 0 else "manual"
        })
    
    return {
        "company": company,
        "college": "GECI",
        "section": section,
        "branch": branch,
        "total_questions": count,
        "questions": questions
    }

def save_question_file(company, section, branch, count=100, output_dir="./questions"):
    """
    Generate and save questions to a JSON file
    
    Args:
        company: Company name
        section: Section name
        branch: Branch name
        count: Number of questions
        output_dir: Directory to save the file
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate questions
    data = generate_questions(company, section, branch, count)
    
    # Create filename
    filename = f"{company.lower()}-{section.lower()}"
    if branch != "ALL":
        filename += f"-{branch.lower()}"
    filename += ".json"
    
    filepath = os.path.join(output_dir, filename)
    
    # Save to file
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated {count} questions for {company} - {section} ({branch})")
    print(f"   Saved to: {filepath}")
    return filepath

def generate_all_company_questions(company, count_per_section=100):
    """
    Generate all question sets for a company
    
    Args:
        company: Company name
        count_per_section: Number of questions per section
    """
    sections = {
        "Aptitude": "ALL",
        "Logical Reasoning": "ALL",
        "Verbal Ability": "ALL",
        "Technical": "CSE"
    }
    
    print(f"\n{'='*60}")
    print(f"Generating questions for: {company}")
    print(f"{'='*60}\n")
    
    for section, branch in sections.items():
        save_question_file(company, section, branch, count_per_section)
    
    print(f"\n✅ All question files generated for {company}!")

# Example usage
if __name__ == "__main__":
    # Generate for single company
    companies = ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini", 
                 "HCL", "Tech Mahindra", "Deloitte", "Mindtree", "KPMG", "EY", "IBM", "L&T", "PwC"]
    
    print("🔥 Question Bank Auto-Generator")
    print("=" * 60)
    
    # Option 1: Generate for single section
    # save_question_file("TCS", "Aptitude", "ALL", 100)
    
    # Option 2: Generate all sections for one company
    # generate_all_company_questions("TCS", 100)
    
    # Option 3: Generate for all companies (uncomment to use)
    # for company in companies:
    #     generate_all_company_questions(company, 100)
    
    # Demo: Generate sample files
    print("\n📝 Demo: Generating sample question files...\n")
    save_question_file("TCS", "Aptitude", "ALL", 50, "./sample_questions")
    save_question_file("Infosys", "Technical", "CSE", 50, "./sample_questions")
    
    print("\n" + "="*60)
    print("✅ Script execution complete!")
    print("="*60)
    print("\nTo generate more questions, uncomment the options in __main__ section")
