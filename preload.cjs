/**
 * QueryKiln — Secure Preload Script + Debug Logging
 * -----------------------------------------------
 * Adds:
 *  - Secure Worker requests (HMAC)
 *  - Debug event emitter to React (window.dispatchEvent)
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {

  /* -----------------------------------------
     LICENSING
  ----------------------------------------- */

  validateLicense: (key) =>
    ipcRenderer.invoke("validate-license", key),

  loadSavedLicense: () =>
    ipcRenderer.invoke("load-saved-license"),

  clearSavedLicense: () =>
    ipcRenderer.invoke("clear-saved-license"),

  /* -----------------------------------------
     SECURE WORKER REQUEST + DEBUG EMITTER
  ----------------------------------------- */

  sendSecureRequest: async (endpoint, payload) => {
    const start = performance.now();

    let result;
    try {
      result = await ipcRenderer.invoke("secure-request", endpoint, payload);
    } catch (err) {
      result = { success: false, error: err.message || "IPC error" };
    }

    const end = performance.now();

    // Emit debug log to renderer
    window.dispatchEvent(new CustomEvent("debug-log", {
      detail: {
        endpoint,
        payload,
        response: result,
        status: result?.error ? "error" : "ok",
        timestamp: new Date().toISOString(),
        duration: Math.round(end - start)
      }
    }));

    return result;
  },

  /* -----------------------------------------
     AUTO-UPDATER
  ----------------------------------------- */

  checkForUpdates: () =>
    ipcRenderer.invoke("check-for-updates"),

  startUpdateDownload: () =>
    ipcRenderer.invoke("start-update-download"),

  quitAndInstall: () =>
    ipcRenderer.invoke("quit-and-install"),

  // Update events
  onUpdateAvailable: (cb) =>
    ipcRenderer.on("update-available", (_, data) => cb(data)),

  onUpdateProgress: (cb) =>
    ipcRenderer.on("update-progress", (_, data) => cb(data)),

  onUpdateDownloaded: (cb) =>
    ipcRenderer.on("update-downloaded", (_, info) => cb(info)),
});
