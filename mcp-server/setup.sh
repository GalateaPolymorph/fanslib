#!/bin/bash

# Setup script for FansLib Electron MCP server

set -e

echo "Setting up FansLib Electron MCP server..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the TypeScript code
echo "Building TypeScript code..."
npm run build

# Create symlink for global access (optional)
echo "Creating global symlink..."
npm link

echo "Setup complete!"
echo ""
echo "To use this MCP server with Claude Code, add the following configuration:"
echo "to your Claude Code settings:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"fanslib-electron\": {"
echo "      \"command\": \"node\","
echo "      \"args\": [\"$(pwd)/dist/index.js\"],"
echo "      \"env\": {}"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "Or run directly with:"
echo "node dist/index.js"