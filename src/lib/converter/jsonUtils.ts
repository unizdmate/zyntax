/**
 * Utilities for handling JSON processing
 */

/**
 * Strips comments from a JSON string before parsing
 * Handles both single-line comments (\/\/) and multi-line comments (\/* *\/)
 */
export function stripJsonComments(jsonString: string): string {
  // Handle single-line comments - only match double slashes that aren't part of a URL
  // This regex looks for double slashes that are either:
  // 1. At the beginning of a line (possibly with whitespace)
  // 2. Preceded by a character that is not : (to avoid matching http://)
  const noSingleLineComments = jsonString.replace(/(?:^|\s|[^:])\/\/.*$/gm, (match) => {
    // Preserve the character before the // if it exists (except when // is at start of line)
    const firstChar = match.charAt(0);
    return firstChar !== '/' ? firstChar : '';
  });
  
  // Then, handle multi-line comments (removing everything between /* and */, including across multiple lines)
  const noComments = noSingleLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
  
  return noComments;
}

/**
 * Validates JSON string, returning parsed object if valid
 * Automatically strips comments before validation
 */
export function validateJson(jsonString: string): { isValid: boolean; error?: string; parsed?: any } {
  try {
    const cleanedJson = stripJsonComments(jsonString);
    const parsed = JSON.parse(cleanedJson);
    return {
      isValid: true,
      parsed
    };
  } catch (err) {
    return {
      isValid: false,
      error: (err as Error).message
    };
  }
}