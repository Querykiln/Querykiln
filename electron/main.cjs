// --------------------------
// Main Electron Process
// --------------------------
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// ------------------------------------
// Detect dev mode
// ------------------------------------
const isDev = !app.isPackaged;

// ------------------------------------
// Logging
// ------------------------------------
log.transports.file.level = "info";
autoUpdater.logger = log;

// ------------------------------------
// Helper to send updates to renderer
// ------------------------------------
function sendStatus(message, data = {}) {
  const win = BrowserWindow.getAllWindows()[0];
  if (!win) return;
  win.webContents.send("update-message", { message, data });
}

// ------------------------------------
// Auto-updater event listeners
// ------------------------------------
autoUpdater.on("checking-for-update", () => sendStatus("checking"));
autoUpdater.on("update-available", (info) => sendStatus("available", info));
autoUpdater.on("update-not-available", () => sendStatus("not-available"));
autoUpdater.on("error", (err) => sendStatus("error", err));
autoUpdater.on("download-progress", (progress) =>
  sendStatus("downloading", progress)
);
autoUpdater.on("update-downloaded", () => {
  sendStatus("downloaded");
  autoUpdater.quitAndInstall();
});

// ------------------------------------
// Create main window
// ------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Querykiln",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// ------------------------------------
// IPC handlers
// ------------------------------------
ipcMain.on("check-for-updates", () => {
  autoUpdater.checkForUpdates();
});

ipcMain.handle("get-app-version", () => app.getVersion());

// ------------------------------------
// App events
// ------------------------------------
app.whenReady().then(() => {
  createWindow();

  if (!isDev) {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 1500);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
