const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// Detect dev mode
const isDev = !app.isPackaged;

// Logging
log.transports.file.level = "info";

// Helper to send update info to UI
function sendStatus(win, message, data = {}) {
  if (!win) return;
  win.webContents.send("update-message", { message, data });
}

// Auto-updater events
autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
  sendStatus(BrowserWindow.getAllWindows()[0], "checking");
});

autoUpdater.on("update-available", (info) => {
  log.info("Update available:", info);
  sendStatus(BrowserWindow.getAllWindows()[0], "available", info);
});

autoUpdater.on("update-not-available", (info) => {
  log.info("No update available:", info);
  sendStatus(BrowserWindow.getAllWindows()[0], "not-available");
});

autoUpdater.on("error", (err) => {
  log.error("Auto-updater error:", err);
  sendStatus(BrowserWindow.getAllWindows()[0], "error", err);
});

autoUpdater.on("download-progress", (progress) => {
  sendStatus(BrowserWindow.getAllWindows()[0], "downloading", progress);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info);
  sendStatus(BrowserWindow.getAllWindows()[0], "downloaded", info);

  autoUpdater.quitAndInstall();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// IPC handlers
ipcMain.on("check-for-updates", () => {
  autoUpdater.checkForUpdates();
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

// App ready
app.whenReady().then(() => {
  createWindow();

  if (!isDev) {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 2000);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
