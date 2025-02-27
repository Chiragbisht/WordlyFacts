import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCKXPiDXzgDkjcZ8KVq5UpHvLjFEiQSh8I";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface FactWithCategory {
  text: string;
  category: string;
  isIndian: boolean;
}

// Define exact category names that will match our color scheme
const CATEGORIES = {
  SCIENCE: "Science",
  TECH: "Tech",
  HISTORY: "History",
  ECONOMICS: "Economics",
  MEDICINE: "Medicine"
};

export async function getFactsForToday(): Promise<FactWithCategory[]> {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const day = today.getDate();

  const prompt = `Generate 8 VERIFIED facts about significant events that DEFINITIVELY occurred on ${month} ${day} in various years throughout history.

    CRITICAL REQUIREMENTS:
    1. ONLY include notable events that happened SPECIFICALLY on ${month} ${day} (day and month must match exactly).
    2. Each fact MUST begin with the year to verify its historical accuracy.
    3. Focus only on SIGNIFICANT historical events - no trivial facts.
    4. Do NOT include any fictional events, unverified claims, or general facts.
    5. Ensure the facts are globally diverse and from different time periods.
    
    GENERATE facts from these categories, balanced equally:
    - SCIENCE: Science & Discovery facts (scientific breakthroughs, discoveries)
    - TECH: Technology & Innovation facts (inventions, patents, tech milestones)
    - HISTORY: History & Culture facts (political events, cultural milestones)
    - ECONOMICS: Economics & Finance facts (important economic events)
    - MEDICINE: Medicine & Health facts (medical breakthroughs, health developments)
    
    Format each fact as:
    "CATEGORY: [Year] - Actual fact description"

    For facts related to Indian history, start with "INDIA:" before the category, but don't prioritize Indian facts over important global events.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the response into facts with categories
    const factLines = text
      .split(/\n+/)
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(fact => fact.length > 0);
    
    const categorizedFacts: FactWithCategory[] = [];
    
    for (const line of factLines) {
      let isIndian = false;
      let category = "General";
      let factText = line;
      
      // Check if it's an Indian fact
      if (line.toUpperCase().startsWith("INDIA:")) {
        isIndian = true;
        factText = line.substring(6).trim(); // Remove "INDIA:"
      }
      
      // Extract category using our defined categories
      for (const [key, value] of Object.entries(CATEGORIES)) {
        if (factText.toUpperCase().startsWith(key + ":")) {
          category = value; // Use our exact category name for color matching
          factText = factText.substring(key.length + 1).trim();
          break;
        }
      }
      
      // Verify that the fact likely contains a year
      if (factText.match(/\[\d{4}\]/) || factText.match(/\d{4}/)) {
        categorizedFacts.push({
          text: factText,
          category,
          isIndian
        });
      }
    }
    
    // Sort primarily by category to ensure visual variety
    const sortedFacts: FactWithCategory[] = [];
    
    // Add facts sorted by category to ensure visual variety
    Object.values(CATEGORIES).forEach(category => {
      const factsOfCategory = categorizedFacts.filter(fact => fact.category === category);
      sortedFacts.push(...factsOfCategory);
    });
    
    // Add any other facts that might have been categorized differently
    categorizedFacts.forEach(fact => {
      if (!sortedFacts.includes(fact)) {
        sortedFacts.push(fact);
      }
    });
    
    // If we somehow have no valid facts, return a message
    if (sortedFacts.length === 0) {
      return [{
        text: "Could not find verified facts for today's date. Please try refreshing.",
        category: "Info",
        isIndian: false
      }];
    }
    
    return sortedFacts;
  } catch (error) {
    console.error("Error fetching facts:", error);
    return [{
      text: "Failed to load facts. Please try again later.",
      category: "Error",
      isIndian: false
    }];
  }
}

// Add a default export
export default {
  getFactsForToday
};
