#!/usr/bin/env node

/**
 * Android Studio MCP Server
 * 
 * A Model Context Protocol server that provides programmatic control over Android Studio
 * and Android project management.
 */

import { startServer } from './core/server.js';

// Start the MCP server
startServer(); 