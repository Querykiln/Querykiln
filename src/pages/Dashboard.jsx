import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import {
  FiCpu,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiLock,
} from "react-icons/fi";

export default function Dashboard() {
  const [license, setLicense] = useState(null);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [checkingWorker, setCheckingWorker] = useState(false);
  const [workerStatus, setWorkerStatus] = useState(null);

  /* -------------------------------------------------------
     LOAD LICENSE ON PAGE LOAD
  ------------------------------------------------------- */
  useEffect(() => {
    window.api.loadSavedLicense().then((data) => {
      setLicense(data);
    });
  }, []);

  /* -------------------------------------------------------
     WORKER STATUS CHECK
  ------------------------------------------------------- */
  const checkWorker = async () => {
    setCheckingWorker(true);
    toast.loading("Checking API connection…", { id: "wk" });

    try {
      const res = await window.api.sendSecureRequest("/rewrite", {
        text: "test",
        tone: "neutral",
        style: "standard",
      });

      if (res?.error) {
        setWorkerStatus("error");
        toast.error("Worker error: " + res.error, { id: "wk" });
      } else {
        setWorkerStatus("ok");
        toast.success("API connection OK", { id: "wk" });
      }
    } catch (err) {
      setWorkerStatus("error");
      toast.error("API unreachable", { id: "wk" });
    }

    setCheckingWorker(false);
  };

  /* -------------------------------------------------------
     CHECK FOR APP UPDATES
  ------------------------------------------------------- */
  const checkUpdates = async () => {
    setCheckingUpdates(true);
    toast.loading("Checking for updates…", { id: "up" });

    const res = await window.api.checkForUpdates();

    if (!res.success) {
      toast.error(res.message || "Update error", { id: "up" });
      setCheckingUpdates(false);
      return;
    }

    if (res.version) {
      toast.success("Update available: v" + res.version, { id: "up" });
    } else {
      toast.success("No updates available", { id: "up" });
    }

    setCheckingUpdates(false);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        description="Overview of your QueryKiln installation."
      />

      {/* LICENSE STATUS */}
      <div className="card">
        <h3 className="card-title">
          <FiLock className="card-icon" />
          License Status
        </h3>

        {license ? (
          <>
            <p>
              <strong>Status:</strong>{" "}
              {license.dev
                ? "Developer Mode"
                : license.mode || "Unknown"}
            </p>
            <p>
              <strong>License Key:</strong>{" "}
              {license.licenseKey?.key
                ? license.licenseKey.key.replace(/.(?=.{4})/g, "*")
                : "Unavailable"}
            </p>
          </>
        ) : (
          <p>No license saved.</p>
        )}

        <a href="#/settings">
          <button className="btn-secondary">Manage License</button>
        </a>
      </div>

      {/* WORKER STATUS */}
      <div className="card">
        <h3 className="card-title">
          <FiCpu className="card-icon" />
          API Connectivity
        </h3>

        {workerStatus === "ok" && (
          <p className="success-text">
            <FiCheckCircle /> Backend Worker is responding normally.
          </p>
        )}

        {workerStatus === "error" && (
          <p className="error-text">
            <FiAlertTriangle /> API is not responding.
          </p>
        )}

        {!workerStatus && <p>Run a connection test.</p>}

        <button
          className={`btn-primary ${
            checkingWorker ? "btn-disabled" : ""
          }`}
          onClick={checkWorker}
          disabled={checkingWorker}
        >
          {checkingWorker ? "Testing…" : "Test API Connection"}
        </button>
      </div>

      {/* UPDATES */}
      <div className="card">
        <h3 className="card-title">
          <FiRefreshCw className="card-icon" />
          Updates
        </h3>

        <button
          className={`btn-secondary ${
            checkingUpdates ? "btn-disabled" : ""
          }`}
          onClick={checkUpdates}
          disabled={checkingUpdates}
        >
          {checkingUpdates ? "Checking…" : "Check for Updates"}
        </button>
      </div>
    </div>
  );
}
