import fs from 'fs';
import path from 'path';
import { runGradleCommand } from './gradle.js';
import { listFiles } from './fileOperations.js';

/**
 * Class for managing Android Studio projects
 */
export class ProjectManager {
  private androidStudioPath: string;
  private projectsBaseDir: string;
  private currentProject: string | null = null;

  /**
   * Create a new ProjectManager instance
   * 
   * @param androidStudioPath Path to the Android Studio installation
   * @param projectsBaseDir Path to the directory containing Android Studio projects
   */
  constructor(androidStudioPath: string, projectsBaseDir: string) {
    this.androidStudioPath = androidStudioPath;
    this.projectsBaseDir = projectsBaseDir;
  }

  /**
   * Get a list of all Android Studio projects in the configured projects directory
   * 
   * @returns Array of project names
   */
  async getProjects(): Promise<string[]> {
    try {
      // In a real implementation, this would scan for valid Android Studio projects
      // by looking for build.gradle or build.gradle.kts files
      const entries = await fs.promises.readdir(this.projectsBaseDir, { withFileTypes: true });
      const projects: string[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(this.projectsBaseDir, entry.name);
          
          // Check if directory contains build.gradle or settings.gradle
          const hasGradleFile = fs.existsSync(path.join(projectPath, 'build.gradle')) || 
                               fs.existsSync(path.join(projectPath, 'build.gradle.kts')) ||
                               fs.existsSync(path.join(projectPath, 'settings.gradle')) ||
                               fs.existsSync(path.join(projectPath, 'settings.gradle.kts'));
                               
          if (hasGradleFile) {
            projects.push(entry.name);
          }
        }
      }
      
      return projects;
    } catch (error) {
      console.error('Error listing projects:', error);
      // For development/placeholder purposes, return sample projects
      return ['SampleProject1', 'SampleProject2'];
    }
  }

  /**
   * Set the current active Android Studio project
   * 
   * @param projectName The name of the project to set as active
   * @returns A confirmation message
   */
  async setCurrentProject(projectName: string): Promise<string> {
    const projects = await this.getProjects();
    
    if (!projects.includes(projectName)) {
      return `Error: Project '${projectName}' not found`;
    }
    
    this.currentProject = projectName;
    return `Set current project to ${projectName}`;
  }

  /**
   * Get the currently active Android Studio project
   * 
   * @returns The name of the currently active project, or a placeholder if none is set
   */
  async getCurrentProject(): Promise<string> {
    if (!this.currentProject) {
      const projects = await this.getProjects();
      if (projects.length > 0) {
        return projects[0]; // Return first project as default
      }
      return 'SampleProject1'; // Fallback for placeholder
    }
    
    return this.currentProject;
  }

  /**
   * Get a list of files in the specified project, optionally filtered by file type
   * 
   * @param projectName The project name to get files from, defaults to current project
   * @param fileType File extension to filter by (e.g., "kt", "java", "xml")
   * @returns A list of file paths relative to the project root
   */
  async getProjectFiles(projectName?: string, fileType?: string): Promise<string[]> {
    const project = projectName || await this.getCurrentProject();
    const projectPath = path.join(this.projectsBaseDir, project);
    
    try {
      const files = await listFiles(projectPath);
      
      if (fileType) {
        return files.filter((file: string) => file.endsWith(`.${fileType}`));
      }
      
      return files;
    } catch (error) {
      console.error('Error listing project files:', error);
      // For development/placeholder purposes, return sample files
      const sampleFiles = [
        'app/src/main/java/com/example/sample/MainActivity.kt',
        'app/src/main/java/com/example/sample/SecondActivity.kt',
        'app/src/main/res/layout/activity_main.xml',
        'app/build.gradle.kts',
        'settings.gradle.kts',
      ];
      
      if (fileType) {
        return sampleFiles.filter((file: string) => file.endsWith(`.${fileType}`));
      }
      
      return sampleFiles;
    }
  }

  /**
   * Get a string representation of the project structure
   * 
   * @param projectName The project name to get structure from, defaults to current project
   * @returns A string representation of the project structure
   */
  async getProjectStructure(projectName?: string): Promise<string> {
    const project = projectName || await this.getCurrentProject();
    
    // In a real implementation, this would analyze the project structure
    // For now, return a placeholder structure
    return `
Project: ${project}
|
+-- app (Module)
|   |
|   +-- Build Variants:
|       +-- debug
|       +-- release
|
+-- library-module (Module)
    |
    +-- Build Variants:
        +-- debug
        +-- release
`;
  }

  /**
   * Run a Gradle task in the specified project
   * 
   * @param task The Gradle task to run (e.g., "assembleDebug", "test")
   * @param projectName The project name to run task in, defaults to current project
   * @returns The output of the Gradle task
   */
  async runGradleTask(task: string, projectName?: string): Promise<string> {
    const project = projectName || await this.getCurrentProject();
    const projectPath = path.join(this.projectsBaseDir, project);
    
    try {
      // In a real implementation, this would execute the Gradle task through the Gradle wrapper
      return await runGradleCommand(projectPath, task);
    } catch (error) {
      console.error('Error running Gradle task:', error);
      // For development/placeholder purposes, return a placeholder message
      return `Running task '${task}' in project '${project}' (placeholder - not actually running)`;
    }
  }
} 