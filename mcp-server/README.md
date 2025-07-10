# FansLib Electron MCP Server

This MCP server allows Claude Code to interact with your FansLib Electron application programmatically. It provides tools for launching the app, taking screenshots, clicking elements, typing text, and more.

## Setup

1. **Install dependencies and build:**

   ```bash
   cd mcp-server
   ./setup.sh
   ```

2. **Configure Claude Code** to use this MCP server by adding it to your settings:
   ```json
   {
     "mcpServers": {
       "fanslib-electron": {
         "command": "node",
         "args": ["./mcp-server/dist/index.js"],
         "env": {}
       }
     }
   }
   ```

## Available Tools

### `electron_launch`

- **Description**: Launch the FansLib Electron application
- **Parameters**:
  - `build_first` (boolean, default: true): Whether to build the app first

### `electron_close`

- **Description**: Close the FansLib Electron application

### `electron_screenshot`

- **Description**: Take a screenshot of the Electron app
- **Parameters**:
  - `path` (string, default: "screenshot.png"): Path to save the screenshot
  - `full_page` (boolean, default: true): Take a full page screenshot

### `electron_click`

- **Description**: Click an element in the Electron app
- **Parameters**:
  - `selector` (string): CSS selector for the element to click
  - `text` (string): Text content to find and click

### `electron_type`

- **Description**: Type text into an input field
- **Parameters**:
  - `selector` (string, required): CSS selector for the input field
  - `text` (string, required): Text to type

### `electron_wait`

- **Description**: Wait for an element to appear
- **Parameters**:
  - `selector` (string, required): CSS selector to wait for
  - `timeout` (number, default: 5000): Timeout in milliseconds

### `electron_evaluate`

- **Description**: Execute JavaScript in the Electron renderer process
- **Parameters**:
  - `code` (string, required): JavaScript code to execute

### `electron_get_text`

- **Description**: Get text content from an element
- **Parameters**:
  - `selector` (string, required): CSS selector for the element

## Usage Examples

Once configured, Claude Code can use these tools to validate changes:

```typescript
// Launch the app
await electron_launch({ build_first: true });

// Take a screenshot
await electron_screenshot({ path: "before-change.png" });

// Click a button
await electron_click({ selector: "[data-testid='submit-btn']" });

// Type in a field
await electron_type({ selector: "input[name='search']", text: "test query" });

// Wait for results
await electron_wait({ selector: ".search-results" });

// Get text content
await electron_get_text({ selector: ".result-count" });

// Take another screenshot
await electron_screenshot({ path: "after-change.png" });

// Close the app
await electron_close();
```

## Benefits

- **Automated Validation**: Claude Code can test changes automatically
- **Visual Feedback**: Screenshots show actual app behavior
- **Real Environment**: Tests run in the actual Electron environment
- **Fast Iteration**: Quickly validate changes without manual testing

## Troubleshooting

- Make sure the FansLib app builds successfully before using the MCP server
- Check that all dependencies are installed in both the main project and mcp-server
- If the app doesn't launch, verify the build output exists in the `out/` directory
