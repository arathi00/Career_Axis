"""
Question bank categories for all major companies
Maps company -> track -> categories with question counts
"""

QUESTION_BANK = {
    "TCS": {
        "Software Engineer": {
            "Technical": [
                {"category": "Arrays", "count": 15, "topics": ["Basic Operations", "Advanced Algorithms", "Memory Optimization"]},
                {"category": "Strings", "count": 20, "topics": ["Pattern Matching", "Manipulation", "Parsing"]},
                {"category": "DBMS", "count": 25, "topics": ["Normalization", "Queries", "Transactions"]},
                {"category": "OOPS", "count": 20, "topics": ["Inheritance", "Polymorphism", "Encapsulation"]},
            ],
            "Aptitude": [
                {"category": "Aptitude", "count": 30, "topics": ["Time & Work", "Percentages", "Probability"]},
            ]
        }
    },
    "Infosys": {
        "Software Engineer": {
            "Technical": [
                {"category": "OOPS Concepts", "count": 20, "topics": ["Inheritance", "Polymorphism", "Abstraction"]},
                {"category": "SQL & DBMS", "count": 20, "topics": ["Queries", "Joins", "Normalization"]},
                {"category": "Data Structures", "count": 25, "topics": ["Arrays", "Linked Lists", "Trees"]},
            ],
            "Logical": [
                {"category": "Logical Reasoning", "count": 25, "topics": ["Series", "Puzzles", "Logic Gates"]},
            ],
            "Coding": [
                {"category": "Pseudocode", "count": 15, "topics": ["Algorithm Writing", "Logic Flow"]},
            ]
        }
    },
    "Wipro": {
        "Software Engineer": {
            "Technical": [
                {"category": "C Programming", "count": 20, "topics": ["Pointers", "Memory", "Functions"]},
                {"category": "Java Basics", "count": 20, "topics": ["OOP", "Collections", "Exceptions"]},
                {"category": "Arrays & Strings", "count": 20, "topics": ["Manipulation", "Search", "Sort"]},
            ],
            "Quantitative": [
                {"category": "Quantitative Aptitude", "count": 30, "topics": ["Percentages", "Ratios", "Speed"]},
            ],
            "HR": [
                {"category": "HR / Behavioral", "count": 15, "topics": ["Situational", "Communication"]},
            ]
        }
    },
    "Accenture": {
        "Software Engineer": {
            "Technical": [
                {"category": "C / C++ Basics", "count": 20, "topics": ["Syntax", "Operators", "Memory"]},
                {"category": "OOPS & Java", "count": 25, "topics": ["Classes", "Interfaces", "Inheritance"]},
                {"category": "DBMS & SQL", "count": 20, "topics": ["Queries", "Transactions", "Indexing"]},
            ],
            "Logical": [
                {"category": "Logical & Analytical Reasoning", "count": 30, "topics": ["Puzzles", "Analysis"]},
            ],
            "HR": [
                {"category": "Communication & HR", "count": 15, "topics": ["Interview", "Teamwork"]},
            ]
        }
    },
    "Cognizant": {
        "Software Engineer": {
            "Technical": [
                {"category": "Java / Python Basics", "count": 25, "topics": ["Syntax", "OOP", "Libraries"]},
                {"category": "Data Structures", "count": 20, "topics": ["Arrays", "Graphs", "Sorting"]},
                {"category": "SQL Queries", "count": 20, "topics": ["Select", "Join", "Aggregate"]},
            ],
            "Aptitude": [
                {"category": "Aptitude", "count": 30, "topics": ["Time & Work", "Percentages", "Probability"]},
            ],
            "Scenario": [
                {"category": "Scenario-based Questions", "count": 15, "topics": ["Problem Solving"]},
            ]
        }
    },
    "Capgemini": {
        "Software Engineer": {
            "Technical": [
                {"category": "Pseudo Code", "count": 20, "topics": ["Algorithm Writing"]},
                {"category": "C Programming", "count": 20, "topics": ["Functions", "Pointers", "Arrays"]},
                {"category": "Cloud & Networking Basics", "count": 15, "topics": ["Cloud Services", "Networks"]},
            ],
            "Aptitude": [
                {"category": "Aptitude", "count": 30, "topics": ["Time & Work", "Percentages"]},
            ],
            "HR": [
                {"category": "Behavioral Questions", "count": 15, "topics": ["Interview", "Teamwork"]},
            ]
        }
    },
    "HCL": {
        "Software Engineer": {
            "Technical": [
                {"category": "C / C++ Programming", "count": 20, "topics": ["Memory", "Pointers"]},
                {"category": "OOPS Concepts", "count": 20, "topics": ["Inheritance", "Polymorphism"]},
                {"category": "Operating Systems", "count": 20, "topics": ["Processes", "Threads", "Memory"]},
                {"category": "SQL & DBMS", "count": 20, "topics": ["Queries", "Normalization"]},
            ],
            "HR": [
                {"category": "HR Interview Questions", "count": 15, "topics": ["Behavioral", "Communication"]},
            ]
        }
    },
    "Tech Mahindra": {
        "Software Engineer": {
            "Technical": [
                {"category": "Java Programming", "count": 20, "topics": ["OOP", "Collections", "Streams"]},
                {"category": "Web Technologies", "count": 20, "topics": ["HTML", "CSS", "JavaScript"]},
                {"category": "SQL & DBMS", "count": 20, "topics": ["Queries", "Transactions"]},
            ],
            "Quantitative": [
                {"category": "Quantitative Aptitude", "count": 25, "topics": ["Percentages", "Ratios"]},
            ],
            "HR": [
                {"category": "HR & Situational Questions", "count": 15, "topics": ["Interview", "Scenarios"]},
            ]
        }
    },
    "Bosch": {
        "Mechanical Engineer": {
            "Core": [
                {"category": "Thermodynamics", "count": 30, "topics": ["First Law", "Second Law", "Cycles"]},
                {"category": "Strength of Materials", "count": 25, "topics": ["Stress", "Strain", "Bending"]},
                {"category": "Manufacturing Processes", "count": 25, "topics": ["Casting", "Welding", "Machining"]},
                {"category": "Fluid Mechanics", "count": 20, "topics": ["Continuity", "Bernoulli", "Flow"]},
            ],
            "Aptitude": [
                {"category": "Engineering Aptitude", "count": 20, "topics": ["Numeracy", "Reasoning"]},
            ]
        }
    },
    "L&T": {
        "Mechanical Engineer": {
            "Core": [
                {"category": "Thermodynamics", "count": 30, "topics": ["Laws", "Cycles"]},
                {"category": "Strength of Materials", "count": 25, "topics": ["Properties", "Design"]},
                {"category": "Fluid Mechanics", "count": 20, "topics": ["Flow Analysis"]},
                {"category": "Engineering Mechanics", "count": 20, "topics": ["Statics", "Dynamics"]},
            ],
            "Aptitude": [
                {"category": "Aptitude", "count": 15, "topics": ["Reasoning", "Numeracy"]},
            ]
        }
    },
    "Siemens": {
        "Electrical Engineer": {
            "Core": [
                {"category": "Engineering Mechanics", "count": 20, "topics": ["Statics", "Dynamics"]},
                {"category": "Control Systems", "count": 20, "topics": ["Transfer Functions", "Feedback"]},
                {"category": "Thermal Engineering", "count": 25, "topics": ["Heat Transfer", "IC Engines"]},
                {"category": "Industrial Automation Basics", "count": 15, "topics": ["PLC", "Sensors"]},
            ],
            "Technical": [
                {"category": "Technical Aptitude", "count": 20, "topics": ["Problem Solving"]},
            ]
        }
    }
}


def get_categories_for_company(company: str, track: str) -> list:
    """Get all categories for a company/track combination"""
    try:
        track_data = QUESTION_BANK[company][track]
        categories = []
        for exam_type, category_list in track_data.items():
            for cat in category_list:
                categories.append({
                    "exam_type": exam_type,
                    "category": cat["category"],
                    "topics": cat["topics"],
                    "total_questions": cat["count"]
                })
        return categories
    except KeyError:
        return []


def get_company_tracks() -> dict:
    """Get all companies and their tracks"""
    return {company: list(tracks.keys()) for company, tracks in QUESTION_BANK.items()}
