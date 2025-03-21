/**
 * Utility functions for the Android Studio MCP server
 */

/**
 * Sleep for a specified duration
 * 
 * @param ms Duration in milliseconds
 * @returns A promise that resolves after the duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a string contains any of the given substrings
 * 
 * @param str The string to check
 * @param substrings Array of substrings to look for
 * @returns True if any substring is found
 */
export function containsAny(str: string, substrings: string[]): boolean {
  return substrings.some(substring => str.includes(substring));
}

/**
 * Format a file path for display
 * 
 * @param filePath The file path to format
 * @param maxLength Maximum length of the formatted path
 * @returns A formatted file path
 */
export function formatPath(filePath: string, maxLength: number = 80): string {
  if (filePath.length <= maxLength) {
    return filePath;
  }
  
  // Split the path
  const parts = filePath.split('/');
  
  // If we only have one part or it's already short enough, return as is
  if (parts.length <= 1) {
    return filePath;
  }
  
  // Keep the file name
  const fileName = parts.pop() || '';
  
  // Keep removing path segments from the middle until it fits
  while (parts.length > 1 && (parts.join('/').length + fileName.length + 4) > maxLength) {
    parts.splice(Math.floor(parts.length / 2), 1);
  }
  
  return parts.join('/') + '/.../' + fileName;
} 