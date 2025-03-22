# Android Studio AI Chat Integration

This repository provides instructions for setting up AI chat capabilities with Android Studio, allowing developers to interact with their code and projects using natural language.

## Overview

By connecting Android Studio to an AI chat interface through the MCP Server plugin, developers can:
- Ask questions about their Android code
- Request code modifications and refactoring
- Get explanations of Android-specific concepts
- Generate new code components
- Debug issues in Android applications

## Prerequisites

- Android Studio installed on your computer
- Cursor IDE installed (for client communication)

## Installation

### Step 1: Install the MCP Server Plugin for JetBrains

1. Open Android Studio
2. Go to **Settings/Preferences** → **Plugins** → **Marketplace**
3. Search for "MCP Server"
4. Click **Install** on the plugin titled "MCP Server" (plugin ID: 26071)
5. Restart Android Studio when prompted

### Step 2: Configure the Client in Cursor

1. Open Cursor and access settings:
   - For Mac: Press `Cmd+,` or go to **Cursor** → **Preferences**
   - For Windows/Linux: Press `Ctrl+,` or go to **File** → **Preferences**

2. Navigate to the AI settings section and enable "JetBrains Integration"

3. Configure your settings:
   ```json
   {
     "mcpServers": {
       "jetbrains": {
         "command": "npx",
         "args": ["-y", "@jetbrains/mcp-proxy"]
       }
     }
   }
   ```

4. If you're running multiple IDEs and want to connect to a specific one, add:
   ```json
   "env": {
     "IDE_PORT": "<port of Android Studio's built-in webserver>"
   }
   ```

5. Save your settings and restart Cursor

## Usage

1. Open Android Studio and load your project
2. Open Cursor and connect to the same project
3. In Cursor, use the built-in chat to interact with your Android Studio project

## Troubleshooting

- **Connection Issues**: Ensure Android Studio is running before attempting to connect from Cursor
- **Plugin Not Found**: Verify you're using a compatible version of Android Studio
- **Multiple IDEs**: If you have multiple JetBrains IDEs running, specify the IDE_PORT in your configuration
- **Permission Issues**: Some operations may require explicit permissions in Android Studio

## Advanced Configuration

To enable logging for debugging purposes:
```json
"env": {
  "LOG_ENABLED": "true"
}
```

To connect to IDE on a different address/host:
```json
"env": {
  "HOST": "<host/address of IDE's built-in webserver>"
}
```

## Resources

- MCP Server Plugin: [https://plugins.jetbrains.com/plugin/26071-mcp-server](https://plugins.jetbrains.com/plugin/26071-mcp-server)
- MCP JetBrains Repository: [https://github.com/JetBrains/mcp-jetbrains](https://github.com/JetBrains/mcp-jetbrains)

## License

This project is licensed under the terms specified in the repository.
