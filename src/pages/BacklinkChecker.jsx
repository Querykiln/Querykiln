import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiLink, FiCopy } from "react-icons/fi";

export default function BacklinkChecker() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------
     RUN BACKLINK CHECK (Worker API)
  ------------------------------------------------------- */
  const runCheck = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    toast.loading("Analyzing backlinks…", { id: "bl" });

    try {
      const res = await window.api.sendSecureRequest("/backlinks", {
        domain,
      });

      if (res?.error) {
        toast.error(res.error, { id: "bl" });
        setLoading(false);
        return;
      }

      setResults(res);
      toast.success("Backlink analysis complete!", { id: "bl" });
    } catch (err) {
      console.error(err);
      toast.error("Backlink analysis failed", { id: "bl" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY RESULTS
  ------------------------------------------------------- */
  const copyResults = () => {
    if (!results) return;

    const text = `
Backlink Count: ${results.backlink_count}
Authority Score: ${results.authority_score}

Top Sources:
${results.top_sources?.map((s) => `- ${s}`).join("\n")}

Recommendations:
${results.recommendations?.map((r) => `- ${r}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Backlink Checker"
        description="Generate estimated backlink insights and authority scoring."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiLink className="card-icon" />
          Domain to Analyze
        </h3>

        <input
          className="input"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={runCheck}
        >
          {loading ? "Analyzing…" : "Run Backlink Checker"}
        </button>
      </div>

      {/* RESULTS CARD */}
      {results && (
        <div className="card">
          <h3 className="card-title">
            Backlink Results
            <button className="btn-icon" onClick={copyResults}>
              <FiCopy size={18} />
            </button>
          </h3>

          <div className="result-block">
            <p>
              <strong>Backlink Count:</strong> {results.backlink_count}
            </p>
            <p>
              <strong>Authority Score:</strong> {results.authority_score}
            </p>
          </div>

          <div className="result-section">
            <h4>Top Sources</h4>
            <ul>
              {results.top_sources?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h4>Recommendations</h4>
            <ul>
              {results.recommendations?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
