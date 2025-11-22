import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiCopy, FiAlertTriangle } from "react-icons/fi";

export default function PlagiarismChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------
     RUN PLAGIARISM CHECK (Worker API)
  ------------------------------------------------------- */
  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to check.");
      return;
    }

    setLoading(true);
    toast.loading("Checking plagiarism…", { id: "plag" });

    try {
      const res = await window.api.sendSecureRequest("/plagiarism", {
        text,
      });

      if (res?.error) {
        toast.error(res.error, { id: "plag" });
        setLoading(false);
        return;
      }

      setResult(res);
      toast.success("Plagiarism check complete!", { id: "plag" });
    } catch (err) {
      console.error(err);
      toast.error("Plagiarism check failed", { id: "plag" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY INPUT TEXT
  ------------------------------------------------------- */
  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Plagiarism Checker"
        description="Check your text for similarity and potential plagiarism sources."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">Text to Analyze</h3>

        <textarea
          className="input-textarea"
          placeholder="Enter text to check…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={checkPlagiarism}
        >
          {loading ? "Checking…" : "Run Plagiarism Check"}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="card plagiarism-results">
          <h3 className="card-title">
            Results
            <span className="score-chip">
              Similarity Score: {result.score}%
            </span>
          </h3>

          {/* WARNING IF HIGH SCORE */}
          {result.score >= 60 && (
            <div className="warning-box">
              <FiAlertTriangle size={18} />
              High similarity detected — review recommended.
            </div>
          )}

          {/* MATCHES */}
          <div className="result-section">
            <h4>Matching Sources</h4>

            {result.matches?.length > 0 ? (
              <ul className="match-list">
                {result.matches.map((match, i) => (
                  <li key={i} className="match-item">
                    <strong>{match.source}</strong>
                    <span className="similarity">
                      Similarity: {match.similarity}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No significant matches found.</p>
            )}
          </div>

          <button className="btn-secondary mt-2" onClick={copyText}>
            <FiCopy style={{ marginRight: "6px" }} />
            Copy Original Text
          </button>
        </div>
      )}
    </div>
  );
}
