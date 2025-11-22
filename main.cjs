/**
 * QueryKiln — Electron Main Process (Secured + Retry Version)
 * -----------------------------------------------------------
 * - Lemon Squeezy Licensing
 * - Secure HMAC-SHA256 Request Signing
 * - Calls Cloudflare Worker Backend
 * - Automatic Retry Protection (Option A)
 * - Auto Updater
 */

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const https = require("https");
const { autoUpdater } = require("electron-updater");
const Store = require("electron-store");
const crypto = require("crypto");

/* --------------------------------------------------
   CONFIG
-------------------------------------------------- */

// Your Worker API root
const WORKER_URL = "https://querykiln-api.gerkinonfire.workers.dev";

// Storage for license
const licenseStore = new Store({
  name: "querykiln-license",
  defaults: { licenseData: null }
});

// Storage for user settings
const keyStore = new Store({
  name: "querykiln-store",
  defaults: { apiKey: null }
});

/* --------------------------------------------------
   WINDOW CREATION
-------------------------------------------------- */

let win = null;
const DEV_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (DEV_URL) {
    setTimeout(() => {
      win.loadURL(DEV_URL);
      win.show();
    }, 400);
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
    win.show();
  }
}

app.whenReady().then(() => {
  createWindow();
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 1500);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* --------------------------------------------------
   LICENSE VALIDATION (LEMON SQUEEZY)
-------------------------------------------------- */

function postToLemon(path, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(bodyObj).toString();

    const req = https.request(
      {
        hostname: "api.lemonsqueezy.com",
        path,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body)
        }
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Invalid Lemon Squeezy response"));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function activateLicenseWithLemon(key) {
  return postToLemon("/v1/licenses/activate", {
    license_key: key,
    instance_name: "QueryKiln Desktop"
  });
}

ipcMain.handle("validate-license", async (_, key) => {
  if (!key) return { success: false, message: "No license entered" };

  const trimmed = key.trim();

  // Dev shortcut
  if (trimmed === "D3V-K3Y-1313") {
    const dev = {
      success: true,
      dev: true,
      mode: "dev",
      message: "Dev license OK",
      licenseKey: { key: trimmed }
    };
    licenseStore.set("licenseData", dev);
    return dev;
  }

  try {
    const data = await activateLicenseWithLemon(trimmed);

    if (!data || !data.activated) {
      return {
        success: false,
        message: data?.error || "License could not be activated"
      };
    }

    const payload = {
      success: true,
      message: "License activated",
      mode: data.license_key?.status,
      licenseKey: data.license_key,
      meta: data.meta
    };

    licenseStore.set("licenseData", payload);
    return payload;

  } catch (err) {
    console.error("License activation error:", err);
    return { success: false, message: "Server or network error" };
  }
});

ipcMain.handle("load-saved-license", () => {
  return licenseStore.get("licenseData", null);
});

ipcMain.handle("clear-saved-license", () => {
  licenseStore.set("licenseData", null);
  return { success: true };
});

/* --------------------------------------------------
   SECURE HMAC REQUEST SIGNING + RETRY PROTECTION
-------------------------------------------------- */

function signRequest(signingSecret, timestamp, body) {
  const hmac = crypto.createHmac("sha256", signingSecret);
  hmac.update(timestamp + body);
  return hmac.digest("hex");
}

ipcMain.handle("secure-request", async (_, endpoint, payload) => {
  const licenseData = licenseStore.get("licenseData", null);

  if (!licenseData || !licenseData.licenseKey || !licenseData.licenseKey.key) {
    return { success: false, error: "No valid license." };
  }

  const licenseKey = licenseData.licenseKey.key;
  const signingSecret = "d4f1c8e2b9a347f8b1c6eac9f5d203ab";

  const timestamp = Date.now().toString();
  const body = JSON.stringify(payload || {});
  const signature = signRequest(signingSecret, timestamp, body);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-license": licenseKey,
      "x-timestamp": timestamp,
      "x-signature": signature
    },
    body
  };

  // -----------------------------------------------------
  // 🔥 Automatic Retry System (Option A)
  // -----------------------------------------------------
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 400;

  async function tryRequest() {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${WORKER_URL}${endpoint}`, requestOptions);

        const text = await response.text();

        try {
          return JSON.parse(text);
        } catch {
          lastError = "Cloudflare returned invalid response.";
        }
      } catch (err) {
        lastError = err.message;
      }

      await new Promise((res) => setTimeout(res, RETRY_DELAY));
    }

    return {
      success: false,
      error: lastError || "Cloudflare is temporarily unavailable."
    };
  }

  return await tryRequest();
});

/* --------------------------------------------------
   AUTO-UPDATER
-------------------------------------------------- */

autoUpdater.autoDownload = false;

ipcMain.handle("check-for-updates", async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return {
      success: true,
      version: result?.updateInfo?.version || null
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle("start-update-download", () => {
  autoUpdater.downloadUpdate();
  return { success: true };
});

ipcMain.handle("quit-and-install", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("update-available", (info) =>
  win?.webContents.send("update-available", info)
);

autoUpdater.on("download-progress", (data) =>
  win?.webContents.send("update-progress", data)
);

autoUpdater.on("update-downloaded", (info) =>
  win?.webContents.send("update-downloaded", info)
);
