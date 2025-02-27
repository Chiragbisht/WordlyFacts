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

  const prompt = `List 7-8 significant historical events that occurred on ${month} ${day}.

    Requirements:
    1. Focus primarily on:
       - Scientific discoveries and innovations
       - Technology breakthroughs
       - Medical advancements
       - Important historical events
    2. Include 2-3 significant Indian historical events
    3. Each fact must start with [YEAR] format
    4. Only include verified historical events
    
    Format:
    CATEGORY: [YYYY] - Event description
    For Indian events, start with "INDIA:"

    Categories to use:
    SCIENCE, TECH, MEDICINE, HISTORY

    Example:
    "SCIENCE: [1953] - Watson and Crick announced DNA structure discovery"
    "INDIA:TECH: [1975] - First Indian satellite launch"`;

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
    
    // Additional verification: Only include facts with clear year markers
    const verifiedFacts = categorizedFacts.filter(fact => {
      const hasYear = fact.text.match(/\[\d{4}\]/);
      const hasDetailedDescription = fact.text.length > 30; // Ensure fact has sufficient detail
      return hasYear && hasDetailedDescription;
    });

    // Sort facts to ensure science/tech/medical appear first
    const sortedFacts = verifiedFacts.sort((a, b) => {
      // Prioritize Science, Tech, and Medicine categories
      const priority: { [key: string]: number } = { 'Science': 1, 'Tech': 2, 'Medicine': 3 };
      const priorityA = priority[a.category] || 4;
      const priorityB = priority[b.category] || 4;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same category, sort by year (most recent first)
      const yearA = parseInt(a.text.match(/\[(\d{4})\]/)?.[1] || '0');
      const yearB = parseInt(b.text.match(/\[(\d{4})\]/)?.[1] || '0');
      return yearB - yearA;
    });

    if (sortedFacts.length === 0) {
      return [{
        text: "No verified historical facts found for this specific date. Please try refreshing.",
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
