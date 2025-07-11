/**
 * Utility functions for working with regular expressions
 */

// Check if a regex pattern is valid
export function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
}

// Test a regex pattern against a string
export function testRegex(
  pattern: string,
  flags: string,
  testString: string
): { success: boolean; matches: RegExpMatchArray | null; error?: string } {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = testString.match(regex);
    return {
      success: true,
      matches,
    };
  } catch (e) {
    return {
      success: false,
      matches: null,
      error: (e as Error).message,
    };
  }
}

import { RegexMatch } from "@/types";

// Get all regex matches with detailed information
export function getAllMatches(
  pattern: string,
  flags: string,
  testString: string
): {
  success: boolean;
  matches: RegexMatch[];
  error?: string;
} {
  try {
    const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
    const matches: RegexMatch[] = [];
    
    let match: RegExpExecArray | null;
    while ((match = regex.exec(testString)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      
      const groups = match.groups || {};
      
      matches.push({
        value: match[0],
        index: match.index,
        groups,
      });
    }
    
    return {
      success: true,
      matches,
    };
  } catch (e) {
    return {
      success: false,
      matches: [],
      error: (e as Error).message,
    };
  }
}

// Common regex patterns
export const commonPatterns = {
  email: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  url: "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
  ipAddress: "(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)",
  phoneUS: "(?:\\d{3}[-.\\s]?){2}\\d{4}",
  date: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
  zipCode: "\\d{5}(?:-\\d{4})?",
};

// Get human-readable description of regex pattern parts
export function getRegexExplanation(pattern: string): string {
  if (!pattern) return "";
  
  try {
    let explanation = "";
    const regexDescription = analyzeRegex(pattern);
    
    // Format the description in a natural language way
    if (pattern.startsWith("^")) {
      explanation += "Starts with ";
    } else {
      explanation += "Matches ";
    }
    
    // Handle common patterns first
    if (isEmailPattern(pattern)) {
      return "Matches an email address (username@domain.tld format)";
    }
    
    if (isUrlPattern(pattern)) {
      return "Matches a URL (web address), supporting http or https protocols";
    }
    
    if (isPhonePattern(pattern)) {
      return "Matches a phone number, typically in formats like 555-555-5555 or (555) 555-5555";
    }
    
    if (isDatePattern(pattern)) {
      if (pattern.includes("\\d{4}-")) {
        return "Matches a date in YYYY-MM-DD format (ISO format)";
      } else if (pattern.includes("/")) {
        if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(pattern)) {
          return "Matches a date in MM/DD/YYYY or DD/MM/YYYY format";
        }
      }
      return "Matches a date pattern";
    }
    
    // Handle character classes and quantifiers
    let characterDescription = "";
    
    if (regexDescription.hasDigits && regexDescription.hasLetters) {
      characterDescription += "letters and digits";
    } else if (regexDescription.hasDigits) {
      characterDescription += "digits";
    } else if (regexDescription.hasLetters) {
      characterDescription += "letters";
    } else if (regexDescription.hasWordChars) {
      characterDescription += "word characters (letters, digits, or underscores)";
    } else if (regexDescription.hasWhitespace) {
      characterDescription += "whitespace characters";
    } else if (regexDescription.hasDot) {
      characterDescription += "any character";
    } else {
      characterDescription += "a pattern";
    }
    
    explanation += characterDescription;
    
    // Add quantifier descriptions
    if (regexDescription.exactCount > 0) {
      explanation += ` exactly ${regexDescription.exactCount} times`;
    } else if (regexDescription.hasPlus) {
      explanation += " one or more times";
    } else if (regexDescription.hasStar) {
      explanation += " zero or more times";
    } else if (regexDescription.hasQuestionMark) {
      explanation += " optionally (zero or one time)";
    } else if (regexDescription.minCount > 0 && regexDescription.maxCount > 0) {
      explanation += ` between ${regexDescription.minCount} and ${regexDescription.maxCount} times`;
    } else if (regexDescription.minCount > 0) {
      explanation += ` at least ${regexDescription.minCount} times`;
    } else if (regexDescription.maxCount > 0) {
      explanation += ` up to ${regexDescription.maxCount} times`;
    }
    
    // Add alternation description
    if (regexDescription.hasAlternation) {
      explanation += " with alternative patterns (OR operation)";
    }
    
    // Add group description
    if (regexDescription.groupCount > 0) {
      explanation += ` with ${regexDescription.groupCount} capturing group${regexDescription.groupCount > 1 ? 's' : ''}`;
    }
    
    // End of string anchor
    if (pattern.endsWith("$")) {
      explanation += " at the end of the text";
    }
    
    return explanation.trim() + ".";
  } catch (error) {
    // Fallback to simpler explanation if the analysis fails
    return getSimpleRegexExplanation(pattern);
  }
}

// Simple fallback explanation for complex patterns
function getSimpleRegexExplanation(pattern: string): string {
  let explanation = "";
  
  // Check for pattern anchors
  if (pattern.startsWith("^")) explanation += "Starts with: ";
  if (pattern.endsWith("$")) explanation += "Ends with: ";
  
  // Check for common character classes
  if (pattern.includes("\\d")) explanation += "digits (0-9). ";
  if (pattern.includes("\\D")) explanation += "non-digit characters. ";
  if (pattern.includes("\\w")) explanation += "word characters (a-z, A-Z, 0-9, _). ";
  if (pattern.includes("\\W")) explanation += "non-word characters. ";
  if (pattern.includes("\\s")) explanation += "whitespace characters. ";
  if (pattern.includes("\\S")) explanation += "non-whitespace characters. ";
  
  // Check for quantifiers
  if (pattern.includes("+")) explanation += "One or more of the preceding item. ";
  if (pattern.includes("*")) explanation += "Zero or more of the preceding item. ";
  if (pattern.includes("?")) explanation += "Zero or one of the preceding item (optional). ";
  
  // Check for character sets
  if (pattern.includes("[a-z]")) explanation += "Lowercase letters. ";
  if (pattern.includes("[A-Z]")) explanation += "Uppercase letters. ";
  if (pattern.includes("[0-9]")) explanation += "Digits. ";
  
  // Check for groups
  const groups = (pattern.match(/\([^?].*?\)/g) || []).length;
  if (groups > 0) explanation += `Contains ${groups} capturing group(s). `;
  
  // Check for alternation
  if (pattern.includes("|")) explanation += "Matches one pattern OR another. ";
  
  // Check for special characters
  if (pattern.includes(".")) explanation += "Matches any single character. ";
  
  return explanation.trim() || "Complex pattern that matches specific text criteria.";
}

// Helper functions to detect common patterns
function isEmailPattern(pattern: string): boolean {
  return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(pattern);
}

function isUrlPattern(pattern: string): boolean {
  return /https?:\/\//.test(pattern);
}

function isPhonePattern(pattern: string): boolean {
  return /\(?\\d{3}\)?[-.\s]?\\d{3}[-.\s]?\\d{4}/.test(pattern) || 
         /\d{3}[-.\\s]?\d{3}[-.\\s]?\d{4}/.test(pattern);
}

function isDatePattern(pattern: string): boolean {
  return /\d{4}-\d{2}-\d{2}/.test(pattern) || // YYYY-MM-DD
         /\d{1,2}\/\d{1,2}\/\d{4}/.test(pattern) || // MM/DD/YYYY or DD/MM/YYYY
         /\d{1,2}[-.\/]\d{1,2}[-.\/]\d{4}/.test(pattern); // Various date separators
}

// Analyze regex pattern structure
function analyzeRegex(pattern: string) {
  return {
    hasDigits: pattern.includes('\\d') || pattern.includes('[0-9]'),
    hasLetters: pattern.includes('[a-z]') || pattern.includes('[A-Z]') || 
                pattern.includes('[a-zA-Z]'),
    hasWordChars: pattern.includes('\\w'),
    hasWhitespace: pattern.includes('\\s'),
    hasDot: pattern.includes('.'),
    hasPlus: /[^\\]\+/.test(pattern),
    hasStar: /[^\\]\*/.test(pattern),
    hasQuestionMark: /[^\\]\?/.test(pattern),
    hasAlternation: pattern.includes('|'),
    groupCount: (pattern.match(/\([^?].*?\)/g) || []).length,
    exactCount: getExactCount(pattern),
    minCount: getMinCount(pattern),
    maxCount: getMaxCount(pattern),
  };
}

// Extract exact count from patterns like \d{3}
function getExactCount(pattern: string): number {
  const match = pattern.match(/\{(\d+)\}(?!\,)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Extract minimum count from patterns like \d{2,}
function getMinCount(pattern: string): number {
  const match = pattern.match(/\{(\d+),/);
  return match ? parseInt(match[1], 10) : 0;
}

// Extract maximum count from patterns like \d{2,5}
function getMaxCount(pattern: string): number {
  const match = pattern.match(/\{(\d+),(\d+)\}/);
  return match ? parseInt(match[2], 10) : 0;
}
