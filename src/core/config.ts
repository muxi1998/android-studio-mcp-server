import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

// Interface for the configuration file structure
export interface Config {
  androidStudio: {
    path: string;
  };
  projects: {
    baseDir: string;
  };
}

// Default configuration
const defaultConfig: Config = {
  androidStudio: {
    path: process.platform === 'darwin' 
      ? '/Applications/Android Studio.app'
      : process.platform === 'win32'
        ? 'C:\\Program Files\\Android\\Android Studio'
        : '/opt/android-studio',
  },
  projects: {
    baseDir: path.join(process.env.HOME || '', 'AndroidStudioProjects'),
  },
};

/**
 * Loads configuration from the config.yml file if it exists,
 * otherwise returns the default configuration.
 */
export function loadConfig(): Config {
  try {
    // Try to find config.yml in the current directory
    const configPath = path.resolve('config.yml');
    
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = yaml.parse(configFile);
      
      // Convert from snake_case (YAML) to camelCase (TypeScript)
      return {
        androidStudio: {
          path: parsedConfig.android_studio?.path || defaultConfig.androidStudio.path,
        },
        projects: {
          baseDir: parsedConfig.projects?.base_dir || defaultConfig.projects.baseDir,
        },
      };
    }
  } catch (error) {
    console.warn('Error loading config file:', error);
  }
  
  console.warn('Warning: config.yml not found. Using default configuration.');
  return defaultConfig;
} 