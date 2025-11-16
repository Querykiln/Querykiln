// src/components/UpdateModal.jsx
import React from "react";

export default function UpdateModal({ update }) {
  if (!update) return null;

  const { status, info, progress } = update;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[380px] text-center">
        <h2 className="text-xl font-semibold mb-3">Software Update</h2>

        {/* Status Messages */}
        {status === "checking" && <p>Checking for updates…</p>}
        {status === "available" && <p>Update available! Downloading…</p>}
        {status === "downloading" && (
          <>
            <p className="mb-2">Downloading update…</p>
            <progress
              value={progress.percent}
              max="100"
              className="w-full"
            ></progress>
            <p className="text-sm mt-2">{progress.percent.toFixed(1)}%</p>
          </>
        )}
        {status === "not-available" && <p>No updates available.</p>}
        {status === "downloaded" && <p>Update ready! Restarting…</p>}
        {status === "error" && <p>Error checking for updates.</p>}
      </div>
    </div>
  );
}
