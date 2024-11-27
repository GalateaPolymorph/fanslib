import { app, BrowserWindow, net, protocol, shell } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { setupLibraryHandlers } from "../features/library/main/handlers";
import { runMigrations } from "../features/library/main/migrations";
import { registerSettingsHandlers } from "../features/settings/main/index";
protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
    },
  },
]);

const registerHandlers = () => {
  registerSettingsHandlers();
  setupLibraryHandlers();
};

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
    mainWindow.show();
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
app.whenReady().then(() => {
  protocol.handle("media", (req) => {
    const pathToMedia = new URL(req.url).pathname;
    return net.fetch(`file://${pathToMedia}`);
  });
  // Set app user model id for windows
  app.setAppUserModelId("com.electron");

  // Register IPC handlers
  registerHandlers();

  // Run database migrations
  runMigrations();

  // Create the main window
  createWindow();

  app.on("activate", () => {
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
