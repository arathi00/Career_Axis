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