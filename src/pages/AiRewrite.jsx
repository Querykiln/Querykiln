import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FiEdit3, FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function AiRewrite() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("neutral");
  const [style, setStyle] = useState("standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------
       RUN REWRITE (Worker API)
  ------------------------------------------------------- */
  const runRewrite = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to rewrite");
      return;
    }

    setLoading(true);
    toast.loading("Rewriting text…", { id: "rw" });

    try {
      const res = await window.api.sendSecureRequest("/rewrite", {
        text,
        tone,
        style,
      });

      if (res?.error) {
        toast.error(res.error, { id: "rw" });
        setLoading(false);
        return;
      }

      setOutput(res.output || "");
      toast.success("Rewrite complete!", { id: "rw" });
    } catch (err) {
      console.error(err);
      toast.error("Rewrite failed", { id: "rw" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
       COPY OUTPUT
  ------------------------------------------------------- */
  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="AI Rewrite"
        description="Rewrite text with improved clarity, flow, and style."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiEdit3 className="card-icon" />
          Original Text
        </h3>

        <textarea
          className="input-textarea"
          placeholder="Enter text to rewrite…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="input-row">
          <div className="input-group">
            <label>Tone</label>
            <select
              className="input-select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="neutral">Neutral</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="confident">Confident</option>
            </select>
          </div>

          <div className="input-group">
            <label>Style</label>
            <select
              className="input-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="simplified">Simplified</option>
              <option value="detailed">Detailed</option>
              <option value="creative">Creative</option>
            </select>
          </div>
        </div>

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={runRewrite}
        >
          {loading ? "Rewriting…" : "Rewrite Text"}
        </button>
      </div>

      {/* OUTPUT CARD */}
      {output && (
        <div className="card">
          <h3 className="card-title">
            Rewritten Text
            <button className="btn-icon" onClick={copyOutput}>
              <FiCopy size={18} />
            </button>
          </h3>

          <textarea
            className="output-textarea"
            value={output}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
