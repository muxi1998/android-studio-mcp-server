import fs from 'fs';
import path from 'path';

/**
 * Recursively list all files in a directory
 * 
 * @param dir The directory to list files from
 * @param baseDir The base directory (used internally for recursion)
 * @param ignoreDirs Directories to ignore (e.g., node_modules, .git)
 * @returns Array of file paths relative to the base directory
 */
export async function listFiles(
  dir: string, 
  baseDir: string = dir,
  ignoreDirs: string[] = ['node_modules', '.gradle', '.git', 'build', 'bin']
): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory()) {
      // Skip ignored directories
      if (ignoreDirs.includes(entry.name)) {
        continue;
      }
      
      // Recursively list files in subdirectory
      const subFiles = await listFiles(fullPath, baseDir, ignoreDirs);
      files.push(...subFiles);
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

/**
 * Read the content of a file
 * 
 * @param filePath Path to the file
 * @returns The content of the file as a string
 */
export async function readFile(filePath: string): Promise<string> {
  return await fs.promises.readFile(filePath, 'utf-8');
}

/**
 * Write content to a file
 * 
 * @param filePath Path to the file
 * @param content Content to write
 * @returns True if the operation was successful
 */
export async function writeFile(filePath: string, content: string): Promise<boolean> {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    
    // Write the file
    await fs.promises.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

/**
 * Check if a file exists
 * 
 * @param filePath Path to the file
 * @returns True if the file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
} 