import React, { useEffect, useState } from "react";
import UpdateModal from "./components/UpdateModal";

function App() {
  const [updateStatus, setUpdateStatus] = useState(null);
  const [appVersion, setAppVersion] = useState("dev");

  // Listen for update events from Electron (only works in production)
  useEffect(() => {
    // Check if preload API exists (it won’t exist during Vite dev)
    if (window.electronAPI?.onUpdateMessage) {
      window.electronAPI.onUpdateMessage((data) => {
        setUpdateStatus({
          status: data.message,
          info: data.data || null,
          progress: data.data?.percent ? data.data : null,
        });
      });
    } else {
      console.warn("Electron API not available (likely running in Vite dev mode).");
    }

    // Get version (only available in production)
    if (window.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then(setAppVersion);
    }
  }, []);

  const handleManualCheck = () => {
    setUpdateStatus({ status: "checking" });

    if (window.electronAPI?.checkForUpdates) {
      window.electronAPI.checkForUpdates();
    } else {
      alert("Updates cannot be checked in dev mode.");
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 text-gray-900">
      
      {/* Auto-update modal */}
      <UpdateModal update={updateStatus} />

      {/* Header */}
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Querykiln</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">v{appVersion}</span>

          <button
            onClick={handleManualCheck}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Check Updates
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="p-6">
        <h2 className="text-xl font-medium mb-3">Welcome to Querykiln</h2>
        <p className="text-gray-700">
          Your AI-powered SEO toolkit is running locally.
        </p>
      </main>
    </div>
  );
}

export default App;
