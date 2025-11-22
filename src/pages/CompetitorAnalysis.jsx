import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiTarget, FiCopy } from "react-icons/fi";

export default function CompetitorAnalysis() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------
     RUN COMPETITOR ANALYSIS (Worker API)
  ------------------------------------------------------- */
  const runCompetitorAnalysis = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a competitor domain");
      return;
    }

    setLoading(true);
    toast.loading("Analyzing competitor…", { id: "comp" });

    try {
      const res = await window.api.sendSecureRequest("/competitors", {
        domain,
      });

      if (res?.error) {
        toast.error(res.error, { id: "comp" });
        setLoading(false);
        return;
      }

      setResults(res);
      toast.success("Competitor analysis complete!", { id: "comp" });
    } catch (err) {
      console.error(err);
      toast.error("Competitor analysis failed", { id: "comp" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY OUTPUT
  ------------------------------------------------------- */
  const copyOutput = () => {
    if (!results) return;

    const text = `
SUMMARY:
${results.summary || ""}

STRENGTHS:
${results.strengths?.map((s) => "- " + s).join("\n")}

WEAKNESSES:
${results.weaknesses?.map((w) => "- " + w).join("\n")}

OPPORTUNITIES:
${results.ranking_opportunities?.map((o) => "- " + o).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Competitor Analysis"
        description="Analyze a competitor's strengths, weaknesses, and ranking opportunities."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiTarget className="card-icon" />
          Competitor Domain
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
          onClick={runCompetitorAnalysis}
        >
          {loading ? "Analyzing…" : "Run Competitor Analysis"}
        </button>
      </div>

      {/* RESULTS CARD */}
      {results && (
        <div className="card">
          <div
            className="card-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Analysis Results</span>
            <button className="btn-icon" onClick={copyOutput}>
              <FiCopy size={18} />
            </button>
          </div>

          <div className="result-section">
            <h4>Summary</h4>
            <p>{results.summary}</p>
          </div>

          <div className="result-section">
            <h4>Strengths</h4>
            <ul>
              {results.strengths?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h4>Weaknesses</h4>
            <ul>
              {results.weaknesses?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h4>Ranking Opportunities</h4>
            <ul>
              {results.ranking_opportunities?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
