// Static/mock data for Assessment module
export const companies = [
  {
    id: "tcs",
    name: "TCS",
    abbreviation: "TCS",
    tags: ["Aptitude", "Technical", "Verbal"],
    overview: "Tata Consultancy Services - India's largest IT services company",
    quizzes: [
      {
        id: "tcs-apt-easy",
        title: "TCS - Aptitude (Easy)",
        track: "TCS",
        level: "Easy",
        type: "Aptitude",
        duration: 10,
        questions: [
          { q: "What is 2+2?", options: ["3","4","5","6"], answer: 1, explanation: "2+2 equals 4." },
          { q: "If x=3, x+2=?", options: ["4","5","6","7"], answer: 1, explanation: "3+2 = 5." }
        ]
      },
      {
        id: "tcs-apt-medium",
        title: "TCS - Aptitude (Medium)",
        type: "Aptitude",
        level: "Medium",
        duration: 12,
        questions: [
          { q: "If a train travels 360 km in 4 hours, what is its speed in km/hr?", options: ["80","90","85","95"], answer: 1, explanation: "Speed = Distance/Time = 360/4 = 90 km/hr." },
          { q: "What is 25% of 200?", options: ["40","50","60","70"], answer: 1, explanation: "25% of 200 = 0.25 × 200 = 50." }
        ]
      },
      {
        id: "tcs-apt-hard",
        title: "TCS - Aptitude (Hard)",
        type: "Aptitude",
        level: "Hard",
        duration: 15,
        questions: [
          { q: "If 5 workers can complete a job in 10 days, how many days will 10 workers take?", options: ["5","10","15","20"], answer: 0, explanation: "Work is inversely proportional to workers. 10 workers take 5 days." }
        ]
      },
      {
        id: "tcs-tech-easy",
        title: "TCS - Technical (Easy)",
        type: "Technical",
        level: "Easy",
        duration: 10,
        questions: [
          { q: "What is the output of 5 + 3 * 2 in most programming languages?", options: ["16","11","10","22"], answer: 1, explanation: "Due to operator precedence, multiplication is done first: 3*2=6, then 5+6=11." }
        ]
      },
      {
        id: "tcs-tech-medium",
        title: "TCS - Technical (Medium)",
        type: "Technical",
        level: "Medium",
        duration: 15,
        questions: [
          { q: "What's the complexity of quicksort in average case?", options: ["O(n)","O(n log n)","O(n^2)","O(log n)"], answer: 1, explanation: "Average quicksort complexity is O(n log n)." }
        ]
      },
      {
        id: "tcs-tech-hard",
        title: "TCS - Technical (Hard)",
        type: "Technical",
        level: "Hard",
        duration: 20,
        questions: [
          { q: "What is the space complexity of merge sort?", options: ["O(1)","O(log n)","O(n)","O(n^2)"], answer: 2, explanation: "Merge sort requires O(n) extra space for merging." }
        ]
      },
      {
        id: "tcs-verbal-easy",
        title: "TCS - Verbal (Easy)",
        type: "Verbal",
        level: "Easy",
        duration: 10,
        questions: [
          { q: "Choose the correct spelling:", options: ["Occassion","Occasion","Ocasion","Occassion"], answer: 1, explanation: "The correct spelling is 'Occasion'." }
        ]
      },
      {
        id: "tcs-verbal-medium",
        title: "TCS - Verbal (Medium)",
        type: "Verbal",
        level: "Medium",
        duration: 12,
        questions: [
          { q: "Which word is a synonym of 'Ephemeral'?", options: ["Permanent","Lasting","Transient","Eternal"], answer: 2, explanation: "Transient means lasting for a short time, similar to ephemeral." }
        ]
      },
      {
        id: "tcs-verbal-hard",
        title: "TCS - Verbal (Hard)",
        type: "Verbal",
        level: "Hard",
        duration: 15,
        questions: [
          { q: "What is the meaning of 'Ubiquitous'?", options: ["Rare","Present everywhere","Hidden","Mysterious"], answer: 1, explanation: "Ubiquitous means present or found everywhere." }
        ]
      }
    ]
  },
  {
    id: "infosys",
    name: "Infosys",
    abbreviation: "INF",
    tags: ["Aptitude", "Technical", "Reasoning"],
    overview: "Global leader in next-generation digital services and consulting",
    totalQuestions: 120,
    quizzes: [
      {
        id: "infosys-apt-easy",
        title: "Infosys - Aptitude (Easy)",
        type: "Aptitude",
        level: "Easy",
        duration: 10,
        questions: [
          { q: "What is 5-2?", options: ["3","2","4","1"], answer: 0, explanation: "5 minus 2 equals 3." }
        ]
      },
      {
        id: "infosys-apt-medium",
        title: "Infosys - Aptitude (Medium)",
        type: "Aptitude",
        level: "Medium",
        duration: 12,
        questions: [
          { q: "If a shopkeeper sells an article at 20% profit and the cost price is ₹500, what is the selling price?", options: ["₹600","₹550","₹650","₹700"], answer: 0, explanation: "SP = CP + 20% of CP = 500 + 100 = ₹600." }
        ]
      },
      {
        id: "infosys-apt-hard",
        title: "Infosys - Aptitude (Hard)",
        type: "Aptitude",
        level: "Hard",
        duration: 15,
        questions: [
          { q: "The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?", options: ["15","20","25","30"], answer: 1, explanation: "If boys:girls = 3:2 and boys = 30, then 30/girls = 3/2, so girls = 20." }
        ]
      },
      {
        id: "infosys-tech-easy",
        title: "Infosys - Technical (Easy)",
        type: "Technical",
        level: "Easy",
        duration: 10,
        questions: [
          { q: "What does API stand for?", options: ["Application Programming Interface","Advanced Program Instruction","Application Process Integration","Automatic Programming Interface"], answer: 0, explanation: "API stands for Application Programming Interface." }
        ]
      },
      {
        id: "infosys-tech-medium",
        title: "Infosys - Technical (Medium)",
        type: "Technical",
        level: "Medium",
        duration: 20,
        questions: [
          { q: "What is Big-O of binary search?", options: ["O(n)","O(log n)","O(n log n)","O(1)"], answer: 1, explanation: "Binary search is logarithmic." }
        ]
      },
      {
        id: "infosys-tech-hard",
        title: "Infosys - Technical (Hard)",
        type: "Technical",
        level: "Hard",
        duration: 20,
        questions: [
          { q: "What is the time complexity of finding the shortest path in a graph using Dijkstra's algorithm?", options: ["O(V)","O(V^2)","O(E log V)","O(V log V)"], answer: 2, explanation: "With a binary heap, Dijkstra's algorithm has O(E log V) complexity." }
        ]
      },
      {
        id: "infosys-reasoning-easy",
        title: "Infosys - Reasoning (Easy)",
        type: "Reasoning",
        level: "Easy",
        duration: 10,
        questions: [
          { q: "What is the next number in the series: 2, 4, 6, 8, ?", options: ["9","10","11","12"], answer: 1, explanation: "This is a sequence of even numbers. The next number is 10." }
        ]
      },
      {
        id: "infosys-reasoning-medium",
        title: "Infosys - Reasoning (Medium)",
        type: "Reasoning",
        level: "Medium",
        duration: 12,
        questions: [
          { q: "If A is taller than B, and B is taller than C, then who is the tallest?", options: ["A","B","C","Cannot determine"], answer: 0, explanation: "By transitive property, A > B > C, so A is the tallest." }
        ]
      },
      {
        id: "infosys-reasoning-hard",
        title: "Infosys - Reasoning (Hard)",
        type: "Reasoning",
        level: "Hard",
        duration: 15,
        questions: [
          { q: "Find the next in series: 2,6,12,20,...", options: ["28","30","26","32"], answer: 0, explanation: "Next is 28 (n^2 + n pattern)." }
        ]
      }
    ]
  },
  {
    id: "wipro",
    name: "Wipro",
    abbreviation: "WIP",
    tags: ["Aptitude", "Technical", "English"],
    overview: "Leading global information technology company",
    quizzes: [
      { id: "wipro-apt-easy", title: "Wipro - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 10-4?", options: ["5","6","7","8"], answer: 1, explanation: "10-4 = 6." } ] },
      { id: "wipro-apt-medium", title: "Wipro - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If 3x = 12, x = ?", options: ["2","3","4","6"], answer: 2, explanation: "3x=12 => x=4." } ] },
      { id: "wipro-apt-hard", title: "Wipro - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "What percentage of 80 is 20?", options: ["20%","25%","30%","35%"], answer: 1, explanation: "20/80 × 100 = 25%." } ] },
      { id: "wipro-tech-easy", title: "Wipro - Technical (Easy)", type: "Technical", level: "Easy", duration: 15, questions: [ { q: "Which data structure uses FIFO?", options: ["Stack","Queue","Tree","Graph"], answer: 1, explanation: "Queue follows FIFO (first-in-first-out)." } ] },
      { id: "wipro-tech-medium", title: "Wipro - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is polymorphism in OOP?", options: ["Same function name with different implementations","Creating multiple objects","Inheriting from multiple classes","None"], answer: 0, explanation: "Polymorphism means same function name with different implementations." } ] },
      { id: "wipro-tech-hard", title: "Wipro - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the time complexity of finding an element in a balanced BST?", options: ["O(1)","O(n)","O(log n)","O(n^2)"], answer: 2, explanation: "Balanced BST search is O(log n)." } ] },
      { id: "wipro-eng-easy", title: "Wipro - English (Easy)", type: "English", level: "Easy", duration: 10, questions: [ { q: "Choose the correct tense: 'He ____ to school every day.'", options: ["go","goes","going","gone"], answer: 1, explanation: "Third person singular requires 'goes'." } ] },
      { id: "wipro-eng-medium", title: "Wipro - English (Medium)", type: "English", level: "Medium", duration: 12, questions: [ { q: "Which is the correct sentence?", options: ["He don't like coffee","He doesn't like coffee","He do not like coffee","He is not liking coffee"], answer: 1, explanation: "The correct form is 'He doesn't like coffee'." } ] },
      { id: "wipro-eng-hard", title: "Wipro - English (Hard)", type: "English", level: "Hard", duration: 15, questions: [ { q: "Identify the error: 'Neither the teacher nor the students was happy.'", options: ["teacher","nor","was","happy"], answer: 2, explanation: "With 'neither...nor', verb agrees with the nearest subject 'students' (plural), so 'were' is correct." } ] }
    ]
  },
  {
    id: "cognizant",
    name: "Cognizant",
    abbreviation: "COG",
    tags: ["Aptitude", "Technical", "Logical"],
    overview: "Professional services company specializing in IT services",
    quizzes: [
      { id: "cog-apt-easy", title: "Cognizant - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 15/3?", options: ["3","4","5","6"], answer: 2, explanation: "15/3 = 5." } ] },
      { id: "cog-apt-medium", title: "Cognizant - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "What is 20% of 150?", options: ["20","30","40","50"], answer: 1, explanation: "20% of 150 = 0.20 × 150 = 30." } ] },
      { id: "cog-apt-hard", title: "Cognizant - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "If a+b=10 and ab=21, find a^2 + b^2.", options: ["58","64","100","38"], answer: 0, explanation: "(a+b)^2 = a^2 + b^2 + 2ab => a^2+b^2=100 -42 =58." } ] },
      { id: "cog-tech-easy", title: "Cognizant - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is a variable?", options: ["A constant value","A named storage location","A function","A class"], answer: 1, explanation: "A variable is a named storage location that holds a value." } ] },
      { id: "cog-tech-medium", title: "Cognizant - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is the time complexity of bubble sort?", options: ["O(n)","O(n log n)","O(n^2)","O(log n)"], answer: 2, explanation: "Bubble sort has O(n^2) time complexity." } ] },
      { id: "cog-tech-hard", title: "Cognizant - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the space complexity of recursive factorial function?", options: ["O(1)","O(n)","O(log n)","O(n^2)"], answer: 1, explanation: "Recursive factorial uses O(n) space due to call stack." } ] },
      { id: "cog-logical-easy", title: "Cognizant - Logical (Easy)", type: "Logical", level: "Easy", duration: 10, questions: [ { q: "Find the odd one out: apple, banana, car, orange", options: ["apple","banana","car","orange"], answer: 2, explanation: "Car is not a fruit; the others are fruits." } ] },
      { id: "cog-logical-medium", title: "Cognizant - Logical (Medium)", type: "Logical", level: "Medium", duration: 12, questions: [ { q: "What is the next in the pattern: 5, 10, 20, 40, ?", options: ["50","60","80","100"], answer: 2, explanation: "Each number is doubled: 5→10→20→40→80." } ] },
      { id: "cog-logical-hard", title: "Cognizant - Logical (Hard)", type: "Logical", level: "Hard", duration: 15, questions: [ { q: "If all cats are animals and all animals have hearts, then all cats have hearts. Is this logic correct?", options: ["Yes","No","Maybe","Cannot determine"], answer: 0, explanation: "This follows the rule of syllogism and is logically correct." } ] }
    ]
  },
  {
    id: "accenture",
    name: "Accenture",
    abbreviation: "ACC",
    tags: ["Aptitude", "Technical", "Verbal"],
    overview: "Global professional services company with digital capabilities",
    totalQuestions: 140,
    quizzes: [
      { id: "acc-apt-easy", title: "Accenture - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 8+7?", options: ["14","15","16","17"], answer: 1, explanation: "8+7 = 15." } ] },
      { id: "acc-apt-medium", title: "Accenture - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If the cost price is ₹100 and profit is 20%, what is the selling price?", options: ["₹110","₹120","₹130","₹140"], answer: 1, explanation: "SP = CP + 20% of CP = 100 + 20 = ₹120." } ] },
      { id: "acc-apt-hard", title: "Accenture - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "A man travels at 50 km/hr for 2 hours, then at 60 km/hr for 3 hours. What is his average speed?", options: ["55 km/hr","56 km/hr","57 km/hr","58 km/hr"], answer: 0, explanation: "Total distance = 50×2 + 60×3 = 280 km. Total time = 5 hours. Avg = 280/5 = 56 km/hr." } ] },
      { id: "acc-tech-easy", title: "Accenture - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What does HTML stand for?", options: ["Hyper Text Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyperlinks and Text Markup Language"], answer: 0, explanation: "HTML stands for Hyper Text Markup Language." } ] },
      { id: "acc-tech-medium", title: "Accenture - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What's the output of: console.log(typeof null) in JavaScript?", options: ["null","object","undefined","null"], answer: 1, explanation: "In JavaScript, typeof null returns 'object' due to a known quirk." } ] },
      { id: "acc-tech-hard", title: "Accenture - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What's the time complexity of insertion in a hash table with linear probing?", options: ["O(1)","O(n)","O(log n)","O(1) average, O(n) worst"], answer: 3, explanation: "Hash table insertion is O(1) on average but O(n) in worst case with collisions." } ] },
      { id: "acc-verbal-easy", title: "Accenture - Verbal (Easy)", type: "Verbal", level: "Easy", duration: 10, questions: [ { q: "What is the opposite of 'happy'?", options: ["Sad","Angry","Mad","Upset"], answer: 0, explanation: "The opposite of 'happy' is 'sad'." } ] },
      { id: "acc-verbal-medium", title: "Accenture - Verbal (Medium)", type: "Verbal", level: "Medium", duration: 12, questions: [ { q: "Choose the word closest in meaning to 'Benevolent':", options: ["Cruel","Kind","Harsh","Angry"], answer: 1, explanation: "Benevolent means kind and generous." } ] },
      { id: "acc-verbal-hard", title: "Accenture - Verbal (Hard)", type: "Verbal", level: "Hard", duration: 15, questions: [ { q: "What does 'Serendipity' mean?", options: ["Coincidence","Finding valuable things by chance","Luck","All of the above"], answer: 3, explanation: "Serendipity means finding something valuable by chance." } ] }
    ]
  },
  {
    id: "capgemini",
    name: "Capgemini",
    abbreviation: "CAP",
    tags: ["Aptitude", "Technical", "Reasoning"],
    overview: "Global leader in consulting and technology services",
    totalQuestions: 110,
    quizzes: [
      { id: "cap-apt-easy", title: "Capgemini - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 10+5?", options: ["10","15","20","25"], answer: 1, explanation: "10+5 = 15." } ] },
      { id: "cap-apt-medium", title: "Capgemini - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "A store offers 30% discount on a ₹500 item. What is the final price?", options: ["₹300","₹350","₹400","₹450"], answer: 2, explanation: "30% of 500 = 150. Final price = 500 - 150 = ₹350." } ] },
      { id: "cap-apt-hard", title: "Capgemini - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "What is the simple interest on ₹1000 at 5% per annum for 2 years?", options: ["₹50","₹100","₹150","₹200"], answer: 1, explanation: "SI = (P × R × T) / 100 = (1000 × 5 × 2) / 100 = ₹100." } ] },
      { id: "cap-tech-easy", title: "Capgemini - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is the time complexity of linear search?", options: ["O(1)","O(log n)","O(n)","O(n^2)"], answer: 2, explanation: "Linear search checks each element, so it's O(n)." } ] },
      { id: "cap-tech-medium", title: "Capgemini - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is the time complexity of linear search?", options: ["O(1)","O(log n)","O(n)","O(n^2)"], answer: 2, explanation: "Linear search has O(n) complexity." } ] },
      { id: "cap-tech-hard", title: "Capgemini - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the space complexity of quicksort with in-place partitioning?", options: ["O(1)","O(log n)","O(n)","O(n^2)"], answer: 1, explanation: "Quicksort uses O(log n) extra space for recursion stack." } ] },
      { id: "cap-reasoning-easy", title: "Capgemini - Reasoning (Easy)", type: "Reasoning", level: "Easy", duration: 10, questions: [ { q: "What comes next: A, B, C, D, ?", options: ["D","E","F","G"], answer: 1, explanation: "Following the alphabet, E comes next." } ] },
      { id: "cap-reasoning-medium", title: "Capgemini - Reasoning (Medium)", type: "Reasoning", level: "Medium", duration: 12, questions: [ { q: "If all birds have wings, and sparrows are birds, then sparrows have wings. This is:", options: ["Deduction","Induction","Abduction","None"], answer: 0, explanation: "This is a deductive reasoning (specific conclusion from general premise)." } ] },
      { id: "cap-reasoning-hard", title: "Capgemini - Reasoning (Hard)", type: "Reasoning", level: "Hard", duration: 15, questions: [ { q: "A clock is 10 minutes slow. At 3:00 PM it shows 2:50 PM. What is the actual time when the clock shows 4:00 PM?", options: ["4:10 PM","4:05 PM","3:50 PM","4:15 PM"], answer: 0, explanation: "If the clock is 10 minutes slow, the actual time is 10 minutes ahead: 4:00 PM + 10 min = 4:10 PM." } ] }
    ]
  },
  {
    id: "hcl",
    name: "HCL",
    abbreviation: "HCL",
    tags: ["Aptitude", "Technical", "Reasoning"],
    overview: "Global IT services and consulting company with diverse solutions",
    totalQuestions: 95,
    quizzes: [
      { id: "hcl-apt-easy", title: "HCL - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 12+8?", options: ["18","19","20","21"], answer: 2, explanation: "12+8 = 20." } ] },
      { id: "hcl-apt-medium", title: "HCL - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "A number is multiplied by 5 and 10 is subtracted. The result is 40. What is the number?", options: ["8","9","10","11"], answer: 1, explanation: "5x - 10 = 40 => 5x = 50 => x = 10." } ] },
      { id: "hcl-apt-hard", title: "HCL - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "In a mixture of 60 liters, milk and water are in the ratio 2:1. How much water should be added to make it 1:2?", options: ["20","30","40","50"], answer: 2, explanation: "Initial: milk=40, water=20. For 1:2, need water=80. Add 60 liters." } ] },
      { id: "hcl-tech-easy", title: "HCL - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is the output of: print(2 ** 3) in Python?", options: ["6","8","16","32"], answer: 1, explanation: "2 ** 3 = 8 (2 to the power of 3)." } ] },
      { id: "hcl-tech-medium", title: "HCL - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is the difference between List and Tuple in Python?", options: ["Lists are mutable, Tuples are immutable","Tuples are mutable, Lists are immutable","Both are mutable","Both are immutable"], answer: 0, explanation: "Lists are mutable (can be modified), while Tuples are immutable (cannot be modified)." } ] },
      { id: "hcl-tech-hard", title: "HCL - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the time complexity of binary search?", options: ["O(n)","O(log n)","O(n^2)","O(1)"], answer: 1, explanation: "Binary search has O(log n) time complexity." } ] },
      { id: "hcl-reasoning-easy", title: "HCL - Reasoning (Easy)", type: "Reasoning", level: "Easy", duration: 10, questions: [ { q: "What is the next number: 1, 2, 4, 8, ?", options: ["12","14","16","18"], answer: 2, explanation: "Each number is doubled: 1→2→4→8→16." } ] },
      { id: "hcl-reasoning-medium", title: "HCL - Reasoning (Medium)", type: "Reasoning", level: "Medium", duration: 12, questions: [ { q: "If today is Monday, what day will it be 10 days later?", options: ["Wednesday","Thursday","Friday","Saturday"], answer: 1, explanation: "Monday + 10 days = 1 week + 3 days = Thursday." } ] },
      { id: "hcl-reasoning-hard", title: "HCL - Reasoning (Hard)", type: "Reasoning", level: "Hard", duration: 15, questions: [ { q: "All flowers are plants. Some plants are trees. Are all flowers trees?", options: ["Yes","No","Maybe","Cannot determine"], answer: 1, explanation: "No, not all flowers are trees. Some flowers might be trees, but not all." } ] }
    ]
  },
  {
    id: "techmahindra",
    name: "Tech Mahindra",
    abbreviation: "TM",
    tags: ["Aptitude", "Technical", "Verbal"],
    overview: "Consulting and IT services company with global presence",
    totalQuestions: 125,
    quizzes: [
      { id: "tm-apt-easy", title: "Tech Mahindra - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 18/3?", options: ["4","5","6","7"], answer: 2, explanation: "18/3 = 6." } ] },
      { id: "tm-apt-medium", title: "Tech Mahindra - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If a triangle has angles 60°, 60°, and x°, what is x?", options: ["50","60","70","80"], answer: 1, explanation: "Sum of angles in a triangle = 180°. x = 180 - 60 - 60 = 60°." } ] },
      { id: "tm-apt-hard", title: "Tech Mahindra - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "A boat takes 5 hours to travel 100 km downstream and 7 hours to travel 100 km upstream. What is the speed of the boat in still water?", options: ["14.28 km/hr","15 km/hr","16.67 km/hr","17 km/hr"], answer: 2, explanation: "Let boat speed = b, current = c. b+c = 20, b-c = 14.28. b = 17.14 km/hr (approx)." } ] },
      { id: "tm-tech-easy", title: "Tech Mahindra - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What does CSS stand for?", options: ["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Core Style Syntax"], answer: 1, explanation: "CSS stands for Cascading Style Sheets." } ] },
      { id: "tm-tech-medium", title: "Tech Mahindra - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is the output of: 1 + '1' in JavaScript?", options: ["2","11","'11'","Error"], answer: 2, explanation: "1 + '1' results in '11' (string concatenation due to type coercion)." } ] },
      { id: "tm-tech-hard", title: "Tech Mahindra - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the space complexity of a hash table?", options: ["O(1)","O(log n)","O(n)","O(n^2)"], answer: 2, explanation: "Hash table space complexity is O(n) where n is the number of elements." } ] },
      { id: "tm-verbal-easy", title: "Tech Mahindra - Verbal (Easy)", type: "Verbal", level: "Easy", duration: 10, questions: [ { q: "What is a synonym of 'Bright'?", options: ["Dark","Clever","Dim","Dull"], answer: 1, explanation: "Clever is a synonym of bright." } ] },
      { id: "tm-verbal-medium", title: "Tech Mahindra - Verbal (Medium)", type: "Verbal", level: "Medium", duration: 12, questions: [ { q: "Complete the sentence: 'The weather was so hot that ____ people fainted.'", options: ["many","several","a few","few"], answer: 0, explanation: "Correct form: 'The weather was so hot that many people fainted.'" } ] },
      { id: "tm-verbal-hard", title: "Tech Mahindra - Verbal (Hard)", type: "Verbal", level: "Hard", duration: 15, questions: [ { q: "What does the phrase 'Break the ice' mean?", options: ["To physically break ice","To start a conversation","To quit something","To freeze something"], answer: 1, explanation: "'Break the ice' is an idiom meaning to start a conversation or make people comfortable." } ] }
    ]
  },
  {
    id: "deloitte",
    name: "Deloitte",
    abbreviation: "DLT",
    tags: ["Aptitude", "Technical", "Business Acumen"],
    overview: "Global professional services firm with management consulting expertise",
    totalQuestions: 135,
    quizzes: [
      { id: "dlt-apt-easy", title: "Deloitte - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 25+15?", options: ["35","40","45","50"], answer: 1, explanation: "25+15 = 40." } ] },
      { id: "dlt-apt-medium", title: "Deloitte - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "A person invests ₹5000 at 10% annual interest. How much will it be in 2 years with compound interest?", options: ["₹5500","₹6000","₹6050","₹6100"], answer: 2, explanation: "A = P(1+r/100)^t = 5000(1.1)^2 = 5000 × 1.21 = ₹6050." } ] },
      { id: "dlt-apt-hard", title: "Deloitte - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "In a company, 60% are engineers, 30% are managers, and the rest are interns. If there are 1000 employees, how many are interns?", options: ["100","150","200","250"], answer: 0, explanation: "Engineers: 600, Managers: 300, Interns: 100 (10% of 1000)." } ] },
      { id: "dlt-tech-easy", title: "Deloitte - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is a database?", options: ["A file folder","An organized collection of data","A program","A network"], answer: 1, explanation: "A database is an organized collection of data stored and accessed electronically." } ] },
      { id: "dlt-tech-medium", title: "Deloitte - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is SQL?", options: ["Simple Question Language","Structured Query Language","System Query Logic","Simple Quick Learning"], answer: 1, explanation: "SQL stands for Structured Query Language, used for database operations." } ] },
      { id: "dlt-tech-hard", title: "Deloitte - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is normalization in databases?", options: ["Organizing data to reduce redundancy","Organizing data alphabetically","Organizing data chronologically","Organizing data by size"], answer: 0, explanation: "Normalization is the process of organizing data to minimize redundancy and improve data integrity." } ] },
      { id: "dlt-ba-easy", title: "Deloitte - Business Acumen (Easy)", type: "Business Acumen", level: "Easy", duration: 10, questions: [ { q: "What does ROI stand for?", options: ["Return on Income","Return on Investment","Ratio of Income","Risk on Investment"], answer: 1, explanation: "ROI stands for Return on Investment." } ] },
      { id: "dlt-ba-medium", title: "Deloitte - Business Acumen (Medium)", type: "Business Acumen", level: "Medium", duration: 12, questions: [ { q: "If a product costs ₹100 to make and sells for ₹150, what is the profit margin?", options: ["25%","30%","33%","50%"], answer: 2, explanation: "Profit margin = (Selling Price - Cost Price) / Selling Price × 100 = 50/150 × 100 = 33.33%." } ] },
      { id: "dlt-ba-hard", title: "Deloitte - Business Acumen (Hard)", type: "Business Acumen", level: "Hard", duration: 15, questions: [ { q: "What is the difference between fixed costs and variable costs?", options: ["No difference","Fixed costs change, variable costs don't","Fixed costs don't change, variable costs do","Both change equally"], answer: 2, explanation: "Fixed costs remain constant (e.g., rent), while variable costs change with production (e.g., raw materials)." } ] }
    ]
  },
  {
    id: "mindtree",
    name: "Mindtree",
    abbreviation: "MTREE",
    tags: ["Aptitude", "Technical", "Problem Solving"],
    overview: "Global technology consulting and services company",
    totalQuestions: 105,
    quizzes: [
      { id: "mtree-apt-easy", title: "Mindtree - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 16+9?", options: ["20","24","25","26"], answer: 2, explanation: "16+9 = 25." } ] },
      { id: "mtree-apt-medium", title: "Mindtree - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If a book costs ₹200 and is sold at 40% discount, what is the selling price?", options: ["₹80","₹100","₹120","₹140"], answer: 2, explanation: "40% of 200 = 80. Selling price = 200 - 80 = ₹120." } ] },
      { id: "mtree-apt-hard", title: "Mindtree - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "The LCM of two numbers is 60 and their GCD is 5. If one number is 20, what is the other?", options: ["12","15","18","20"], answer: 1, explanation: "Using LCM × GCD = Product of numbers: 60 × 5 = 20 × x => x = 15." } ] },
      { id: "mtree-tech-easy", title: "Mindtree - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is the output of: console.log(5 === '5')?", options: ["true","false","undefined","error"], answer: 1, explanation: "5 === '5' is false because === checks both value and type (number vs string)." } ] },
      { id: "mtree-tech-medium", title: "Mindtree - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is a REST API?", options: ["A type of database","An architectural style for web services","A programming language","A server framework"], answer: 1, explanation: "REST API is an architectural style for designing networked applications using HTTP requests." } ] },
      { id: "mtree-tech-hard", title: "Mindtree - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the difference between synchronous and asynchronous operations?", options: ["No difference","Sync waits for completion, Async doesn't","Async waits for completion, Sync doesn't","Both are the same"], answer: 1, explanation: "Synchronous operations block and wait for completion, while asynchronous operations don't block." } ] },
      { id: "mtree-ps-easy", title: "Mindtree - Problem Solving (Easy)", type: "Problem Solving", level: "Easy", duration: 10, questions: [ { q: "What is 2 + 2 * 3?", options: ["12","8","20","24"], answer: 1, explanation: "Following PEMDAS: 2 * 3 = 6, then 2 + 6 = 8." } ] },
      { id: "mtree-ps-medium", title: "Mindtree - Problem Solving (Medium)", type: "Problem Solving", level: "Medium", duration: 12, questions: [ { q: "If 3 workers can paint a wall in 4 hours, how long will 2 workers take?", options: ["4 hours","6 hours","8 hours","10 hours"], answer: 1, explanation: "Total work = 3 × 4 = 12 worker-hours. With 2 workers: 12/2 = 6 hours." } ] },
      { id: "mtree-ps-hard", title: "Mindtree - Problem Solving (Hard)", type: "Problem Solving", level: "Hard", duration: 15, questions: [ { q: "A jar contains red, blue, and green balls in ratio 3:4:5. If there are 24 blue balls, how many total balls are there?", options: ["72","84","96","108"], answer: 2, explanation: "If blue (4 parts) = 24, then 1 part = 6. Total = (3+4+5) × 6 = 96." } ] }
    ]
  },
  {
    id: "kpmg",
    name: "KPMG",
    abbreviation: "KPMG",
    tags: ["Aptitude", "Technical", "Financial Analysis"],
    overview: "Global professional services firm specializing in audit, tax, and advisory",
    totalQuestions: 130,
    quizzes: [
      { id: "kpmg-apt-easy", title: "KPMG - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 30-12?", options: ["15","18","20","22"], answer: 1, explanation: "30-12 = 18." } ] },
      { id: "kpmg-apt-medium", title: "KPMG - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "A train travels 300 km in 5 hours. What is its average speed?", options: ["50 km/hr","60 km/hr","75 km/hr","100 km/hr"], answer: 1, explanation: "Speed = Distance/Time = 300/5 = 60 km/hr." } ] },
      { id: "kpmg-apt-hard", title: "KPMG - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "The average of 5 numbers is 40. If one number is removed, the average becomes 38. What is the removed number?", options: ["40","45","48","50"], answer: 2, explanation: "Total of 5 = 40 × 5 = 200. Total of 4 = 38 × 4 = 152. Removed = 200 - 152 = 48." } ] },
      { id: "kpmg-tech-easy", title: "KPMG - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is Big Data?", options: ["Small data sets","Large and complex data sets","Average data","Irrelevant data"], answer: 1, explanation: "Big Data refers to large and complex data sets that are difficult to process with traditional methods." } ] },
      { id: "kpmg-tech-medium", title: "KPMG - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is cloud computing?", options: ["Computing on clouds","On-demand computing resources over the internet","Physical computers in a room","Local storage only"], answer: 1, explanation: "Cloud computing is the delivery of computing resources (servers, storage, etc.) over the internet." } ] },
      { id: "kpmg-tech-hard", title: "KPMG - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the difference between SQL and NoSQL databases?", options: ["No difference","SQL is relational, NoSQL is non-relational","NoSQL is relational, SQL is not","Both are identical"], answer: 1, explanation: "SQL databases are relational and structured, NoSQL databases are non-relational and flexible." } ] },
      { id: "kpmg-fa-easy", title: "KPMG - Financial Analysis (Easy)", type: "Financial Analysis", level: "Easy", duration: 10, questions: [ { q: "What is profit?", options: ["Total expenses","Revenue minus expenses","Revenue plus expenses","Total income"], answer: 1, explanation: "Profit = Revenue - Expenses." } ] },
      { id: "kpmg-fa-medium", title: "KPMG - Financial Analysis (Medium)", type: "Financial Analysis", level: "Medium", duration: 12, questions: [ { q: "If net income is ₹100,000 and total assets are ₹500,000, what is ROA?", options: ["10%","15%","20%","25%"], answer: 2, explanation: "ROA = (Net Income / Total Assets) × 100 = (100,000 / 500,000) × 100 = 20%." } ] },
      { id: "kpmg-fa-hard", title: "KPMG - Financial Analysis (Hard)", type: "Financial Analysis", level: "Hard", duration: 15, questions: [ { q: "What is the debt-to-equity ratio if total debt is ₹150,000 and total equity is ₹250,000?", options: ["0.6","0.75","1.0","1.5"], answer: 0, explanation: "Debt-to-Equity = Total Debt / Total Equity = 150,000 / 250,000 = 0.6." } ] }
    ]
  },
  {
    id: "ey",
    name: "EY",
    abbreviation: "EY",
    tags: ["Aptitude", "Technical", "Strategic Thinking"],
    overview: "Global leader in assurance, tax, transaction, and advisory services",
    totalQuestions: 128,
    quizzes: [
      { id: "ey-apt-easy", title: "EY - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 45/9?", options: ["4","5","6","7"], answer: 1, explanation: "45/9 = 5." } ] },
      { id: "ey-apt-medium", title: "EY - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If 7 oranges cost ₹35, how much do 9 oranges cost?", options: ["₹40","₹45","₹50","₹55"], answer: 1, explanation: "Cost per orange = 35/7 = ₹5. Cost of 9 = 5 × 9 = ₹45." } ] },
      { id: "ey-apt-hard", title: "EY - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "A sum of money becomes 1.5 times in 3 years at simple interest. What is the rate of interest?", options: ["12%","14%","16.67%","20%"], answer: 2, explanation: "Amount = P + SI. 1.5P = P + SI => SI = 0.5P. SI = (P × R × T)/100 => 0.5P = (P × R × 3)/100 => R = 16.67%." } ] },
      { id: "ey-tech-easy", title: "EY - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is artificial intelligence?", options: ["Natural intelligence","Machine ability to learn and make decisions","Robots only","Supercomputers"], answer: 1, explanation: "AI is the ability of machines to learn from experience and make intelligent decisions." } ] },
      { id: "ey-tech-medium", title: "EY - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is machine learning?", options: ["Manual learning","Algorithms that improve through experience","Teaching machines manually","Building robots"], answer: 1, explanation: "Machine learning is a subset of AI where algorithms improve automatically through experience." } ] },
      { id: "ey-tech-hard", title: "EY - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is cybersecurity?", options: ["Internet surfing","Protection against unauthorized access and attacks","Physical security","Online shopping"], answer: 1, explanation: "Cybersecurity involves protecting systems and data from unauthorized access and cyberattacks." } ] },
      { id: "ey-st-easy", title: "EY - Strategic Thinking (Easy)", type: "Strategic Thinking", level: "Easy", duration: 10, questions: [ { q: "What is a business strategy?", options: ["Daily tasks","A plan to achieve business goals","Hiring employees","Marketing only"], answer: 1, explanation: "Business strategy is a plan or approach to achieve organizational goals." } ] },
      { id: "ey-st-medium", title: "EY - Strategic Thinking (Medium)", type: "Strategic Thinking", level: "Medium", duration: 12, questions: [ { q: "What is SWOT analysis?", options: ["A financial tool","Analysis of Strengths, Weaknesses, Opportunities, Threats","Marketing strategy","Sales technique"], answer: 1, explanation: "SWOT is a strategic planning tool analyzing internal strengths/weaknesses and external opportunities/threats." } ] },
      { id: "ey-st-hard", title: "EY - Strategic Thinking (Hard)", type: "Strategic Thinking", level: "Hard", duration: 15, questions: [ { q: "What is Porter's Five Forces model used for?", options: ["Production management","Analyzing industry attractiveness and competition","Employee management","Financial planning"], answer: 1, explanation: "Porter's Five Forces analyzes the competitive intensity and attractiveness of an industry." } ] }
    ]
  },
  {
    id: "ibm",
    name: "IBM",
    abbreviation: "IBM",
    tags: ["Aptitude", "Technical", "Systems Design"],
    overview: "Global technology and consulting company specializing in cloud and AI solutions",
    totalQuestions: 140,
    quizzes: [
      { id: "ibm-apt-easy", title: "IBM - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 22+33?", options: ["50","55","60","65"], answer: 1, explanation: "22+33 = 55." } ] },
      { id: "ibm-apt-medium", title: "IBM - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "A batsman scored an average of 50 runs in 4 matches. In the 5th match, he scored 70 runs. What is his new average?", options: ["52","54","56","58"], answer: 1, explanation: "Total in 4 matches = 50 × 4 = 200. Total in 5 = 200 + 70 = 270. New average = 270/5 = 54." } ] },
      { id: "ibm-apt-hard", title: "IBM - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "If a rectangle has perimeter 40 cm and length 12 cm, what is its area?", options: ["96 cm²","100 cm²","108 cm²","120 cm²"], answer: 0, explanation: "Perimeter = 2(L+W) => 40 = 2(12+W) => W = 8. Area = L × W = 12 × 8 = 96 cm²." } ] },
      { id: "ibm-tech-easy", title: "IBM - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is a microprocessor?", options: ["A small processor","The main computing unit of a computer","A motherboard","A memory unit"], answer: 1, explanation: "A microprocessor is the central processing unit that performs calculations and controls operations." } ] },
      { id: "ibm-tech-medium", title: "IBM - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is Docker?", options: ["Software for docking ships","Containerization platform for applications","A database tool","A programming language"], answer: 1, explanation: "Docker is a platform for containerizing applications to run consistently across environments." } ] },
      { id: "ibm-tech-hard", title: "IBM - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the difference between vertical and horizontal scaling?", options: ["No difference","Vertical adds resources to existing machine, Horizontal adds more machines","Horizontal adds to one machine, Vertical adds more machines","Both are identical"], answer: 1, explanation: "Vertical scaling adds resources to a single machine, Horizontal scaling adds more machines." } ] },
      { id: "ibm-sd-easy", title: "IBM - Systems Design (Easy)", type: "Systems Design", level: "Easy", duration: 10, questions: [ { q: "What is a system architecture?", options: ["Building design","Blueprint of software/hardware structure","Interior design","Network cables"], answer: 1, explanation: "System architecture is the conceptual blueprint defining the structure and behavior of a system." } ] },
      { id: "ibm-sd-medium", title: "IBM - Systems Design (Medium)", type: "Systems Design", level: "Medium", duration: 12, questions: [ { q: "What is a load balancer?", options: ["A fitness device","Distributes traffic across multiple servers","A storage device","A security tool"], answer: 1, explanation: "A load balancer distributes network traffic across multiple servers to optimize resource use." } ] },
      { id: "ibm-sd-hard", title: "IBM - Systems Design (Hard)", type: "Systems Design", level: "Hard", duration: 15, questions: [ { q: "What is microservices architecture?", options: ["Small services only","Decentralized architecture with independent services","Monolithic design","Single service architecture"], answer: 1, explanation: "Microservices is an architectural style where applications are composed of independent, loosely coupled services." } ] }
    ]
  },
  {
    id: "larsen-toubro",
    name: "L&T",
    abbreviation: "LT",
    tags: ["Aptitude", "Technical", "Engineering"],
    overview: "Major engineering and construction company with diversified operations",
    totalQuestions: 115,
    quizzes: [
      { id: "lt-apt-easy", title: "L&T - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 19+26?", options: ["40","42","45","48"], answer: 2, explanation: "19+26 = 45." } ] },
      { id: "lt-apt-medium", title: "L&T - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If a project takes 10 workers 20 days to complete, how many days will 25 workers take?", options: ["6","8","10","12"], answer: 1, explanation: "Total work = 10 × 20 = 200 worker-days. With 25 workers: 200/25 = 8 days." } ] },
      { id: "lt-apt-hard", title: "L&T - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "A contractor can build a bridge in 40 days using 50 workers. Due to rain, 20% time is lost. How many workers are needed to complete on time?", options: ["50","60","65","70"], answer: 2, explanation: "Available time = 40 × 0.8 = 32 days. Workers needed = 50 × 40/32 = 62.5 ≈ 63." } ] },
      { id: "lt-tech-easy", title: "L&T - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is CAD?", options: ["Computer Aided Design","Computer Architecture Diagram","Code Analysis Design","Computer Automated Device"], answer: 0, explanation: "CAD stands for Computer-Aided Design, used for creating technical drawings and designs." } ] },
      { id: "lt-tech-medium", title: "L&T - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is BIM?", options: ["Building Information Modeling","Basic Information Module","Business Information Management","Building Implementation Management"], answer: 0, explanation: "BIM is Building Information Modeling, a digital representation of physical and functional characteristics." } ] },
      { id: "lt-tech-hard", title: "L&T - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is structural engineering?", options: ["Making structures beautiful","Design and analysis of structures to safely support loads","Painting structures","Decorating buildings"], answer: 1, explanation: "Structural engineering involves designing structures to safely support loads and remain stable." } ] },
      { id: "lt-eng-easy", title: "L&T - Engineering (Easy)", type: "Engineering", level: "Easy", duration: 10, questions: [ { q: "What is Newton's First Law?", options: ["Speed equals distance/time","An object in motion stays in motion unless acted upon by force","Force equals mass times acceleration","Energy cannot be created"], answer: 1, explanation: "Newton's First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by force." } ] },
      { id: "lt-eng-medium", title: "L&T - Engineering (Medium)", type: "Engineering", level: "Medium", duration: 12, questions: [ { q: "What is Young's Modulus?", options: ["Age of material","Measure of stiffness of material","Color of material","Weight of material"], answer: 1, explanation: "Young's Modulus measures how resistant a material is to being deformed elastically." } ] },
      { id: "lt-eng-hard", title: "L&T - Engineering (Hard)", type: "Engineering", level: "Hard", duration: 15, questions: [ { q: "What is the difference between brittle and ductile materials?", options: ["No difference","Brittle breaks suddenly, ductile deforms before breaking","Ductile breaks suddenly, brittle deforms","Both behave the same"], answer: 1, explanation: "Brittle materials break suddenly without much deformation, ductile materials deform significantly before breaking." } ] }
    ]
  },
  {
    id: "pwc",
    name: "PwC",
    abbreviation: "PWC",
    tags: ["Aptitude", "Technical", "Audit & Assurance"],
    overview: "Global professional services network in audit, tax, and consulting",
    totalQuestions: 138,
    quizzes: [
      { id: "pwc-apt-easy", title: "PwC - Aptitude (Easy)", type: "Aptitude", level: "Easy", duration: 10, questions: [ { q: "What is 36/6?", options: ["5","6","7","8"], answer: 1, explanation: "36/6 = 6." } ] },
      { id: "pwc-apt-medium", title: "PwC - Aptitude (Medium)", type: "Aptitude", level: "Medium", duration: 12, questions: [ { q: "If a discount of 15% is given on a ₹800 item, what is the final price?", options: ["₹620","₹650","₹680","₹720"], answer: 2, explanation: "15% of 800 = 120. Final price = 800 - 120 = ₹680." } ] },
      { id: "pwc-apt-hard", title: "PwC - Aptitude (Hard)", type: "Aptitude", level: "Hard", duration: 15, questions: [ { q: "A merchant buys goods for ₹5000 and sells them at a loss of 10%. Later, he buys similar goods for ₹4000 and sells at a profit of 20%. What is his net profit/loss?", options: ["Loss of ₹200","Profit of ₹200","Loss of ₹300","Profit of ₹300"], answer: 1, explanation: "First transaction: Loss = 10% of 5000 = 500 (Loss). Second: Profit = 20% of 4000 = 800 (Profit). Net = -500 + 800 = 300 (Profit)." } ] },
      { id: "pwc-tech-easy", title: "PwC - Technical (Easy)", type: "Technical", level: "Easy", duration: 10, questions: [ { q: "What is blockchain?", options: ["Building blocks","Distributed ledger technology","Chain of blocks","Database only"], answer: 1, explanation: "Blockchain is a distributed ledger technology that records transactions securely." } ] },
      { id: "pwc-tech-medium", title: "PwC - Technical (Medium)", type: "Technical", level: "Medium", duration: 15, questions: [ { q: "What is cryptocurrency?", options: ["Currency that is hidden","Digital currency based on cryptography","Ancient currency","Money without value"], answer: 1, explanation: "Cryptocurrency is a digital currency that uses cryptography for security and is decentralized." } ] },
      { id: "pwc-tech-hard", title: "PwC - Technical (Hard)", type: "Technical", level: "Hard", duration: 20, questions: [ { q: "What is the difference between public and private blockchain?", options: ["No difference","Public is open to all, private is restricted","Private is open to all, public is restricted","Both are identical"], answer: 1, explanation: "Public blockchains are open to anyone, private blockchains have restricted access." } ] },
      { id: "pwc-aa-easy", title: "PwC - Audit & Assurance (Easy)", type: "Audit & Assurance", level: "Easy", duration: 10, questions: [ { q: "What is an audit?", options: ["Checking attendance","Systematic examination of accounts and records","Writing reports","Financial planning"], answer: 1, explanation: "An audit is a systematic examination of financial records to verify accuracy and compliance." } ] },
      { id: "pwc-aa-medium", title: "PwC - Audit & Assurance (Medium)", type: "Audit & Assurance", level: "Medium", duration: 12, questions: [ { q: "What is internal audit?", options: ["External examination","In-house examination by organization's employees","Government audit","Third-party audit"], answer: 1, explanation: "Internal audit is conducted by an organization's own staff to evaluate internal controls and operations." } ] },
      { id: "pwc-aa-hard", title: "PwC - Audit & Assurance (Hard)", type: "Audit & Assurance", level: "Hard", duration: 15, questions: [ { q: "What is materiality in auditing?", options: ["Physical materials","Significance threshold for reporting misstatements","Amount of transactions","Audit findings"], answer: 1, explanation: "Materiality is the threshold at which financial information is considered significant for decision-making." } ] }
    ]
  }
];

// Ensure other companies have proper abbreviations too
companies.forEach(c => {
  if (!c.abbreviation) {
    c.abbreviation = c.name.substring(0, 3).toUpperCase();
  }
  if (!c.totalQuestions) {
    c.totalQuestions = c.quizzes.reduce((acc,q) => acc + (q.questions?.length || 0), 0);
  }
});

// helper to collect questions by company id, type and difficulty
export function getQuestions(companyId, quizType, difficulty){
  const c = companies.find(x => x.id === companyId || x.name === companyId);
  if (!c) return [];
  let pool = [];
  c.quizzes.forEach(q => {
    if (quizType && q.type && q.type !== quizType) return;
    if (difficulty && q.level && q.level.toLowerCase() !== difficulty.toLowerCase()) return;
    (q.questions || []).forEach(qq => pool.push(qq));
  });
  return pool;
}