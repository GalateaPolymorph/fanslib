#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import path from "path";
import { ElectronApplication, _electron as electron } from "playwright";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class FansLibElectronMCP {
  private server: Server;
  private electronApp: ElectronApplication | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "fanslib-electron-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      if (this.electronApp) {
        await this.electronApp.close();
      }
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "electron_launch",
          description: "Launch the FansLib Electron application",
          inputSchema: {
            type: "object",
            properties: {
              build_first: {
                type: "boolean",
                description: "Whether to build the app first",
                default: true,
              },
            },
          },
        },
        {
          name: "electron_close",
          description: "Close the FansLib Electron application",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "electron_screenshot",
          description: "Take a screenshot of the Electron app",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to save the screenshot",
                default: "screenshot.png",
              },
              full_page: {
                type: "boolean",
                description: "Take a full page screenshot",
                default: true,
              },
            },
          },
        },
        {
          name: "electron_click",
          description: "Click an element in the Electron app",
          inputSchema: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description: "CSS selector for the element to click",
              },
              text: {
                type: "string",
                description: "Text content to find and click",
              },
            },
          },
        },
        {
          name: "electron_type",
          description: "Type text into an input field",
          inputSchema: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description: "CSS selector for the input field",
              },
              text: {
                type: "string",
                description: "Text to type",
              },
            },
            required: ["selector", "text"],
          },
        },
        {
          name: "electron_wait",
          description: "Wait for an element to appear",
          inputSchema: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description: "CSS selector to wait for",
              },
              timeout: {
                type: "number",
                description: "Timeout in milliseconds",
                default: 5000,
              },
            },
            required: ["selector"],
          },
        },
        {
          name: "electron_evaluate",
          description: "Execute JavaScript in the Electron renderer process",
          inputSchema: {
            type: "object",
            properties: {
              code: {
                type: "string",
                description: "JavaScript code to execute",
              },
            },
            required: ["code"],
          },
        },
        {
          name: "electron_get_text",
          description: "Get text content from an element",
          inputSchema: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description: "CSS selector for the element",
              },
            },
            required: ["selector"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "electron_launch":
            return await this.launchElectron(args?.build_first as boolean);
          case "electron_close":
            return await this.closeElectron();
          case "electron_screenshot":
            return await this.takeScreenshot(args?.path as string, args?.full_page as boolean);
          case "electron_click":
            return await this.clickElement(args?.selector as string, args?.text as string);
          case "electron_type":
            return await this.typeText(args?.selector as string, args?.text as string);
          case "electron_wait":
            return await this.waitForElement(args?.selector as string, args?.timeout as number);
          case "electron_evaluate":
            return await this.evaluateCode(args?.code as string);
          case "electron_get_text":
            return await this.getText(args?.selector as string);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async launchElectron(buildFirst: boolean = true) {
    if (this.electronApp) {
      return {
        content: [
          {
            type: "text",
            text: "Electron app is already running",
          },
        ],
      };
    }

    const projectRoot = path.join(__dirname, "../..");

    if (buildFirst) {
      const { spawn } = await import("child_process");
      await new Promise<void>((resolve, reject) => {
        const build = spawn("npm", ["run", "build"], {
          cwd: projectRoot,
          stdio: "inherit",
        });
        build.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Build failed with code ${code}`));
        });
      });
    }

    const mainPath = path.join(projectRoot, "out", "main", "index.js");

    const fs = await import("fs");
    const os = await import("os");

    // Get the same user data directory that electron-vite dev uses
    const userDataDir = path.join(os.homedir(), "Library", "Application Support", "fanslib");

    this.electronApp = await electron.launch({
      args: [`--user-data-dir=${userDataDir}`, mainPath],
      timeout: 30000,
      cwd: projectRoot,
    });

    // Capture console logs from the Electron app
    this.electronApp.on("console", (msg) => {
      console.error(`[Electron Console] ${msg.type()}: ${msg.text()}`);
    });

    const page = await this.electronApp.firstWindow();
    page.on("console", (msg) => {
      console.error(`[Electron Page] ${msg.type()}: ${msg.text()}`);
    });

    return {
      content: [
        {
          type: "text",
          text: "FansLib Electron app launched successfully",
        },
      ],
    };
  }

  private async closeElectron() {
    if (!this.electronApp) {
      return {
        content: [
          {
            type: "text",
            text: "No Electron app is running",
          },
        ],
      };
    }

    await this.electronApp.close();
    this.electronApp = null;

    return {
      content: [
        {
          type: "text",
          text: "Electron app closed successfully",
        },
      ],
    };
  }

  private async takeScreenshot(
    screenshotPath: string = "screenshot.png",
    fullPage: boolean = true
  ) {
    if (!this.electronApp) {
      throw new Error("Electron app is not running");
    }

    const page = await this.electronApp.firstWindow();
    const projectRoot = path.join(__dirname, "../..");
    const fullPath = path.join(projectRoot, screenshotPath);

    await page.screenshot({ path: fullPath, fullPage });

    return {
      content: [
        {
          type: "text",
          text: `Screenshot saved to ${fullPath}`,
        },
      ],
    };
  }

  private async clickElement(selector?: string, text?: string) {
    if (!this.electronApp) {
      throw new Error("Electron app is not running");
    }

    const page = await this.electronApp.firstWindow();

    if (selector) {
      await page.click(selector);
    } else if (text) {
      await page.click(`text=${text}`);
    } else {
      throw new Error("Either selector or text must be provided");
    }

    return {
      content: [
        {
          type: "text",
          text: `Clicked element ${selector || `with text "${text}"`}`,
        },
      ],
    };
  }

  private async typeText(selector: string, text: string) {
    if (!this.electronApp) {
      throw new Error("Electron app is not running");
    }

    const page = await this.electronApp.firstWindow();
    await page.fill(selector, text);

    return {
      content: [
        {
          type: "text",
          text: `Typed "${text}" into ${selector}`,
        },
      ],
    };
  }

  private async waitForElement(selector: string, timeout: number = 5000) {
    if (!this.electronApp) {
      throw new Error("Electron app is not running");
    }

    const page = await this.electronApp.firstWindow();
    await page.waitForSelector(selector, { timeout });

    return {
      content: [
        {
          type: "text",
          text: `Element ${selector} appeared`,
        },
      ],
    };
  }

  private async evaluateCode(code: string) {
    if (!this.electronApp) {
      throw new Error("Electron app is not running");
    }

    const page = await this.electronApp.firstWindow();
    const result = await page.evaluate(code);

    return {
      content: [
        {
          type: "text",
          text: `Result: ${JSON.stringify(result)}`,
        },
      ],
    };
  }

  private async getText(selector: string) {
    if (!this.electronApp) {
      throw new Error("Electron app is not running");
    }

    const page = await this.electronApp.firstWindow();
    const text = await page.textContent(selector);

    return {
      content: [
        {
          type: "text",
          text: `Text content: ${text}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("FansLib Electron MCP server running on stdio");
  }
}

const server = new FansLibElectronMCP();
server.run().catch(console.error);
