// Utility to load and manage JSON-based question banks

/**
 * Standard Question Structure:
 * {
 *   company: "TCS",
 *   college: "GECI",
 *   section: "Aptitude | Logical | Verbal | Technical",
 *   branch: "ALL | CSE | MECH | ECE | EEE",
 *   total_questions: 100,
 *   questions: [
 *     {
 *       id: "APT_001",
 *       question: "Question text",
 *       options: ["A", "B", "C", "D"],
 *       answer: "Correct option",
 *       difficulty: "easy | medium | hard",
 *       source: "manual | ai"
 *     }
 *   ]
 * }
 */

// Import JSON question files
import tcsAptitude from './questions/tcs-aptitude.json';
import tcsLogical from './questions/tcs-logical.json';
import tcsVerbal from './questions/tcs-verbal.json';
import tcsTechnicalCSE from './questions/tcs-technical-cse.json';
import { getQuestionsByCompany } from '@/data/questionBankLoader';
const questions = getQuestionsByCompany("TCS", "Aptitude");
// Question bank registry
const questionBanks = {
  'TCS': {
    'Aptitude': tcsAptitude,
    'Logical': tcsLogical,
    'Verbal': tcsVerbal,
    'Technical-CSE': tcsTechnicalCSE
    
  }
  // Add more companies here as JSON files are created
};

/**
 * Get questions by company, section, and optional filters
 * @param {string} company - Company name (e.g., "TCS")
 * @param {string} section - Section name (e.g., "Aptitude")
 * @param {string} branch - Branch name (optional, default "ALL")
 * @param {string} difficulty - Difficulty filter (optional: "easy", "medium", "hard")
 * @param {number} limit - Maximum number of questions to return (optional)
 * @returns {Array} Array of question objects
 */
export function getQuestionsByCompany(company, section, branch = "ALL", difficulty = null, limit = null) {
  const companyBanks = questionBanks[company];
  
  if (!companyBanks) {
    console.warn(`No question bank found for company: ${company}`);
    return [];
  }
  
  // Construct key for the section
  let key = section;
  if (branch !== "ALL" && section === "Technical") {
    key = `${section}-${branch}`;
  }
  
  const bank = companyBanks[key];
  
  if (!bank) {
    console.warn(`No question bank found for ${company} - ${section} - ${branch}`);
    return [];
  }
  
  let questions = [...bank.questions];
  
  // Filter by difficulty if specified
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  
  // Limit number of questions if specified
  if (limit && limit > 0) {
    questions = questions.slice(0, limit);
  }
  
  return questions;
}

/**
 * Get random questions from a question bank
 * @param {string} company - Company name
 * @param {string} section - Section name
 * @param {number} count - Number of random questions to return
 * @param {string} difficulty - Optional difficulty filter
 * @returns {Array} Array of random question objects
 */
export function getRandomQuestions(company, section, count = 10, difficulty = null) {
  const questions = getQuestionsByCompany(company, section, "ALL", difficulty);
  
  // Shuffle and return requested count
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get question statistics for a company/section
 * @param {string} company - Company name
 * @param {string} section - Section name
 * @returns {Object} Statistics object with counts by difficulty
 */
export function getQuestionStats(company, section) {
  const questions = getQuestionsByCompany(company, section);
  
  return {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
    manual: questions.filter(q => q.source === 'manual').length,
    ai: questions.filter(q => q.source === 'ai').length
  };
}

/**
 * Get all available companies
 * @returns {Array} Array of company names
 */
export function getAvailableCompanies() {
  return Object.keys(questionBanks);
}

/**
 * Get all available sections for a company
 * @param {string} company - Company name
 * @returns {Array} Array of section names
 */
export function getAvailableSections(company) {
  const companyBanks = questionBanks[company];
  if (!companyBanks) return [];
  
  return Object.keys(companyBanks).map(key => {
    // Remove branch suffix if present
    return key.includes('-') ? key.split('-')[0] : key;
  });
}

/**
 * Convert JSON question format to legacy format (for backward compatibility)
 * @param {Object} jsonQuestion - Question in JSON format
 * @param {number} index - Question index
 * @returns {Object} Question in legacy format
 */
export function convertToLegacyFormat(jsonQuestion, index = 0) {
  return {
    q: jsonQuestion.question,
    options: jsonQuestion.options,
    answer: jsonQuestion.options.indexOf(jsonQuestion.answer),
    explanation: `The correct answer is: ${jsonQuestion.answer}`
  };
}

/**
 * Get quiz data in legacy format for backward compatibility
 * @param {string} company - Company name
 * @param {string} section - Section name
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Quiz object in legacy format
 */
export function getLegacyQuiz(company, section, difficulty) {
  const questions = getQuestionsByCompany(company, section, "ALL", difficulty);
  
  return {
    id: `${company.toLowerCase()}-${section.toLowerCase()}-${difficulty}`,
    title: `${company} - ${section} (${difficulty})`,
    type: section,
    level: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    duration: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
    questions: questions.map((q, index) => convertToLegacyFormat(q, index))
  };
}

export default {
  getQuestionsByCompany,
  getRandomQuestions,
  getQuestionStats,
  getAvailableCompanies,
  getAvailableSections,
  convertToLegacyFormat,
  getLegacyQuiz
};
