const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateMessage: (callback) =>
    ipcRenderer.on("update-message", (_, data) => callback(data)),
    
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),

  getVersion: () => ipcRenderer.invoke("get-app-version")
});
