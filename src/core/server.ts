import { MCP } from '@modelcontextprotocol/sdk';
import { loadConfig } from './config.js';
import { ProjectManager } from '../ide/project.js';

/**
 * Starts the MCP server and registers all tools
 */
export async function startServer() {
  // Load configuration
  const config = loadConfig();

  // Initialize the Android Studio project manager
  const projectManager = new ProjectManager(
    config.androidStudio.path,
    config.projects.baseDir
  );

  // Create a new MCP server
  const mcp = new MCP("android-studio");

  // Register tools
  
  /**
   * Get a list of all Android Studio projects
   */
  mcp.tools.add({
    name: "get_project_list",
    description: "Get a list of all Android Studio projects in the configured projects directory.",
    parameters: [],
    handler: async () => {
      return projectManager.getProjects();
    }
  });

  /**
   * Get the currently active Android Studio project
   */
  mcp.tools.add({
    name: "get_current_project",
    description: "Get the currently active Android Studio project.",
    parameters: [],
    handler: async () => {
      return projectManager.getCurrentProject();
    }
  });

  /**
   * Set the current active Android Studio project
   */
  mcp.tools.add({
    name: "set_current_project",
    description: "Set the current active Android Studio project.",
    parameters: [
      {
        name: "project_name",
        type: "string",
        description: "The name of the project to set as active"
      }
    ],
    handler: async ({ project_name }) => {
      return projectManager.setCurrentProject(project_name);
    }
  });

  /**
   * List files in the current project, optionally filtered by file type
   */
  mcp.tools.add({
    name: "list_project_files",
    description: "List files in the current project, optionally filtered by file type.",
    parameters: [
      {
        name: "file_type",
        type: "string",
        description: "File extension to filter by (e.g., 'kt', 'java', 'xml')",
        required: false
      }
    ],
    handler: async ({ file_type }) => {
      return projectManager.getProjectFiles(undefined, file_type);
    }
  });

  /**
   * Get the structure of the current project
   */
  mcp.tools.add({
    name: "get_project_structure",
    description: "Get the structure of the current project, including modules and build variants.",
    parameters: [],
    handler: async () => {
      return projectManager.getProjectStructure();
    }
  });

  /**
   * Run a build task in the current project
   */
  mcp.tools.add({
    name: "run_build_task",
    description: "Run a build task in the current project.",
    parameters: [
      {
        name: "task",
        type: "string",
        description: "The Gradle task to run (e.g., 'assembleDebug', 'test')"
      }
    ],
    handler: async ({ task }) => {
      return projectManager.runGradleTask(task);
    }
  });

  // Start the server
  console.log("Starting Android Studio MCP server...");
  await mcp.serve();
} 