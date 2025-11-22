import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiLayers, FiCopy } from "react-icons/fi";

export default function ContentGap() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------
     RUN CONTENT GAP ANALYSIS (Worker API)
  ------------------------------------------------------- */
  const runGap = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    toast.loading("Running content gap analysis…", { id: "gap" });

    try {
      const res = await window.api.sendSecureRequest("/content-gap", {
        domain,
      });

      if (res?.error) {
        toast.error(res.error, { id: "gap" });
        setLoading(false);
        return;
      }

      setResults(res);
      toast.success("Content gap analysis complete!", { id: "gap" });
    } catch (err) {
      console.error(err);
      toast.error("Content gap analysis failed", { id: "gap" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY OUTPUT
  ------------------------------------------------------- */
  const copyOutput = () => {
    if (!results) return;

    const text = `
MISSING TOPICS:
${results.missing_topics?.map((t) => "- " + t).join("\n")}

COMPETITOR ADVANTAGES:
${results.competitor_advantages?.map((t) => "- " + t).join("\n")}

OPPORTUNITIES:
${results.opportunities?.map((t) => "- " + t).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Content Gap Analysis"
        description="Discover missing topics and opportunities based on competitor content."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiLayers className="card-icon" />
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
          onClick={runGap}
        >
          {loading ? "Analyzing…" : "Run Content Gap Analysis"}
        </button>
      </div>

      {/* RESULTS CARD */}
      {results && (
        <div className="card">
          <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Content Gap Results</span>
            <button className="btn-icon" onClick={copyOutput}>
              <FiCopy size={18} />
            </button>
          </div>

          <div className="result-section">
            <h4>Missing Topics</h4>
            <ul>
              {results.missing_topics?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h4>Competitor Advantages</h4>
            <ul>
              {results.competitor_advantages?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h4>Opportunities</h4>
            <ul>
              {results.opportunities?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
