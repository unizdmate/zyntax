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
  let explanation = "";
  
  // This is a very simplified explanation generator
  // A comprehensive one would require a proper regex parser
  
  if (pattern.includes("\\d")) explanation += "Matches digits. ";
  if (pattern.includes("\\w")) explanation += "Matches word characters. ";
  if (pattern.includes("\\s")) explanation += "Matches whitespace. ";
  if (pattern.includes("[a-z]")) explanation += "Matches lowercase letters. ";
  if (pattern.includes("[A-Z]")) explanation += "Matches uppercase letters. ";
  if (pattern.includes("^")) explanation += "Anchors to the start of a line. ";
  if (pattern.includes("$")) explanation += "Anchors to the end of a line. ";
  if (pattern.includes("+")) explanation += "Matches one or more of the preceding token. ";
  if (pattern.includes("*")) explanation += "Matches zero or more of the preceding token. ";
  if (pattern.includes("?")) explanation += "Matches zero or one of the preceding token. ";
  
  return explanation || "Complex pattern, no simple explanation available.";
}
