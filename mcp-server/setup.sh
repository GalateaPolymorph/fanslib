#!/bin/bash

# Setup script for FansLib Electron MCP server
set -e
echo "Setting up FansLib Electron MCP server..."
echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Done!"