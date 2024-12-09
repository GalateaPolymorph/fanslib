import "reflect-metadata";

import { app, BrowserWindow, net, protocol, shell } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { IpcRegistry } from "./IpcRegistry";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true,
      standard: true,
      corsEnabled: true,
    },
  },
]);

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    if (process.env.DEVELOPMENT) {
      mainWindow.showInactive();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  protocol.handle("media", (req) => {
    const pathToMedia = decodeURIComponent(new URL(req.url).href.replace("media:/", ""));
    const fileUrl = `file://${pathToMedia}`;

    return net.fetch(fileUrl).catch((error) => {
      console.error("Error fetching media:", error);
      return new Response("Error fetching media", { status: 500 });
    });
  });

  // Set app user model id for windows
  app.setAppUserModelId("com.electron");

  // Register IPC handlers
  const ipcRegistry = new IpcRegistry();
  ipcRegistry.registerAll();

  // Create window
  createWindow();

  // Sync schedules with posts
  try {
    const { syncSchedulesWithPosts } = await import("../features/posts/sync-manager");
    const syncedCount = await syncSchedulesWithPosts();
    console.log(`Synced ${syncedCount} schedules with posts`);
  } catch (error) {
    console.error("Failed to sync schedules with posts:", error);
  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
