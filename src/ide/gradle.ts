import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

/**
 * Run a Gradle command in the specified project directory
 * 
 * @param projectDir The directory of the Android project
 * @param task The Gradle task to run
 * @returns The output of the Gradle command
 */
export async function runGradleCommand(projectDir: string, task: string): Promise<string> {
  // Determine if we should use gradlew or gradle
  const hasGradlew = fs.existsSync(
    path.join(projectDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew')
  );
  
  const gradleCommand = hasGradlew 
    ? path.join(projectDir, process.platform === 'win32' ? 'gradlew.bat' : './gradlew')
    : 'gradle';
  
  try {
    // Execute the Gradle command
    const { stdout, stderr } = await execPromise(`${gradleCommand} ${task}`, {
      cwd: projectDir,
    });
    
    if (stderr) {
      console.warn(`Gradle warning: ${stderr}`);
    }
    
    return stdout;
  } catch (error: any) {
    // If there was an error executing the command
    if (error.stderr) {
      throw new Error(`Gradle error: ${error.stderr}`);
    }
    
    throw error;
  }
}

/**
 * Get available Gradle tasks for a project
 * 
 * @param projectDir The directory of the Android project
 * @returns Array of available Gradle tasks
 */
export async function getGradleTasks(projectDir: string): Promise<string[]> {
  try {
    const output = await runGradleCommand(projectDir, 'tasks --all');
    
    // Parse the output to extract task names
    const taskLines = output.split('\n').filter(line => line.trim().match(/^[a-zA-Z][a-zA-Z0-9]*( - .+)?$/));
    
    // Extract just the task names
    return taskLines.map(line => line.split(' - ')[0].trim());
  } catch (error) {
    console.error('Error getting Gradle tasks:', error);
    return [];
  }
} 