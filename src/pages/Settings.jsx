// src/pages/Settings.jsx

import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import {
  FiKey,
  FiCheckCircle,
  FiAlertTriangle,
  FiShoppingCart,
} from "react-icons/fi";

export default function Settings() {
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseData, setLicenseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkingWorker, setCheckingWorker] = useState(false);
  const [workerStatus, setWorkerStatus] = useState(null);

  const STORE_URL = "https://querykiln.lemonsqueezy.com/";

  /* -------------------------------------------------------
     LOAD SAVED LICENSE
  ------------------------------------------------------- */
  useEffect(() => {
    window.api.loadSavedLicense().then((data) => {
      setLicenseData(data);
      setLoading(false);
    });
  }, []);

  /* -------------------------------------------------------
     ACTIVATE LICENSE
  ------------------------------------------------------- */
  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      toast.error("Please enter a license key.");
      return;
    }

    toast.loading("Activating license…", { id: "ls" });

    const res = await window.api.validateLicense(licenseKey.trim());

    if (!res.success) {
      toast.error(res.message || "Activation failed.", { id: "ls" });
      return;
    }

    setLicenseData(res);
    toast.success("License activated!", { id: "ls" });

    setLicenseKey("");
  };

  /* -------------------------------------------------------
     DEACTIVATE LICENSE
  ------------------------------------------------------- */
  const handleDeactivate = async () => {
    toast.loading("Removing license…", { id: "ls2" });

    await window.api.clearSavedLicense();
    setLicenseData(null);

    toast.success("License removed.", { id: "ls2" });
  };

  /* -------------------------------------------------------
     CHECK WORKER (API CONNECTIVITY)
  ------------------------------------------------------- */
  const checkWorker = async () => {
    setCheckingWorker(true);
    toast.loading("Testing API…", { id: "wk" });

    try {
      const res = await window.api.sendSecureRequest("/rewrite", {
        text: "test",
        tone: "neutral",
        style: "default",
      });

      if (res?.error) {
        setWorkerStatus("error");
        toast.error(res.error, { id: "wk" });
      } else {
        setWorkerStatus("ok");
        toast.success("API connection OK!", { id: "wk" });
      }
    } catch (err) {
      setWorkerStatus("error");
      toast.error("API unreachable", { id: "wk" });
    }

    setCheckingWorker(false);
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        description="Manage your license and system configuration."
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          {/* -----------------------------------------------------
             LICENSE CARD
          ----------------------------------------------------- */}
          <div className="card">
            <h3 className="card-title">
              <FiKey className="card-icon" />
              License Key
            </h3>

            {!licenseData ? (
              <>
                <input
                  type="text"
                  className="input"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />

                <button className="btn-primary" onClick={handleActivate}>
                  Activate License
                </button>

                {/* BUY LICENSE BUTTON */}
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    marginTop: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                  }}
                >
                  <FiShoppingCart /> Buy a License
                </a>
              </>
            ) : (
              <>
                <p>
                  <strong>Status:</strong>{" "}
                  {licenseData.dev
                    ? "Developer Mode"
                    : licenseData.mode || "Active"}
                </p>

                <p>
                  <strong>Key:</strong>{" "}
                  {licenseData.licenseKey?.key
                    ? licenseData.licenseKey.key.replace(/.(?=.{4})/g, "*")
                    : "Hidden"}
                </p>

                <button
                  className="btn-danger"
                  onClick={handleDeactivate}
                  style={{ marginTop: "8px" }}
                >
                  Deactivate License
                </button>

                {/* SHOW STORE LINK EVEN WHEN ACTIVATED */}
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    marginTop: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                  }}
                >
                  <FiShoppingCart /> Manage Subscription
                </a>
              </>
            )}
          </div>

          {/* -----------------------------------------------------
             WORKER TEST CARD
          ----------------------------------------------------- */}
          <div className="card">
            <h3 className="card-title">API Connectivity</h3>

            {workerStatus === "ok" && (
              <p className="success-text">
                <FiCheckCircle /> Worker is running normally.
              </p>
            )}

            {workerStatus === "error" && (
              <p className="error-text">
                <FiAlertTriangle /> Worker failed to respond.
              </p>
            )}

            {!workerStatus && <p>Run a quick connection test.</p>}

            <button
              className={`btn-secondary ${
                checkingWorker ? "btn-disabled" : ""
              }`}
              disabled={checkingWorker}
              onClick={checkWorker}
            >
              {checkingWorker ? "Testing…" : "Test Worker Connection"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
