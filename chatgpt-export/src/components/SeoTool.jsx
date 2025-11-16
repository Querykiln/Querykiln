import React, { useState } from "react";
import { jsPDF } from "jspdf";

// Simple word-frequency for word cloud
const getWordFrequency = (text) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/);

  const freq = {};
  words.forEach((w) => {
    if (!w) return;
    freq[w] = (freq[w] || 0) + 1;
  });
  return freq;
};

// Simple plagiarism mock check
const fakePlagiarismCheck = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 25) + 5;
      resolve({ score, message: score > 20 ? "High similarity" : "Low similarity" });
    }, 800);
  });
};

export default function SeoTool() {
  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [seoScore, setSeoScore] = useState(null);
  const [readability, setReadability] = useState(null);
  const [wordDensity, setWordDensity] = useState([]);
  const [cloud, setCloud] = useState([]);
  const [plagiarism, setPlagiarism] = useState(null);
  const [loadingPlagiarism, setLoadingPlagiarism] = useState(false);

  // Generate keyword list
  const extractKeywords = () => {
    const words = input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4);

    const freq = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((w) => w[0]);

    setKeywords(sorted);
  };

  // SEO scoring algorithm (simple)
  const generateSeoScore = () => {
    let score = 0;

    if (input.length > 300) score += 20;
    if (keywords.length >= 5) score += 20;
    if (input.includes(".")) score += 20;
    if (input.split(" ").length > 150) score += 20;

    score += Math.min(20, input.split(/\s+/).filter((w) => w.length > 6).length);

    setSeoScore(score);
  };

  // Readability score (Flesch estimate)
  const calculateReadability = () => {
    const words = input.split(/\s+/).length;
    const sentences = input.split(".").length;
    const syllables = input.replace(/[^aeiou]/gi, "").length;

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    setReadability(Math.max(0, Math.min(100, Math.floor(score))));
  };

  // Word density
  const calculateWordDensity = () => {
    const words = input.toLowerCase().split(/\s+/);
    const total = words.length;

    const freq = {};
    words.forEach((w) => {
      if (!w) return;
      freq[w] = (freq[w] || 0) + 1;
    });

    const sorted = Object.entries(freq).map(([word, count]) => ({
      word,
      percent: ((count / total) * 100).toFixed(2),
    }));

    setWordDensity(sorted.slice(0, 20));
  };

  // Word cloud
  const generateWordCloud = () => {
    const freq = getWordFrequency(input);
    const cloudArray = Object.entries(freq).map(([word, count]) => ({
      word,
      size: 12 + count * 4,
    }));
    setCloud(cloudArray.slice(0, 30));
  };

  // Plagiarism check
  const runPlagiarismCheck = async () => {
    setLoadingPlagiarism(true);
    const result = await fakePlagiarismCheck(input);
    setPlagiarism(result);
    setLoadingPlagiarism(false);
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("SEO Report", 10, 10);
    doc.text(`Keywords: ${keywords.join(", ")}`, 10, 20);
    doc.text(`SEO Score: ${seoScore}`, 10, 30);
    doc.text(`Readability: ${readability}`, 10, 40);
    doc.text(`Plagiarism: ${plagiarism?.score}%`, 10, 50);
    doc.save("seo-report.pdf");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-center">🚀 SEO Optimization Tool</h1>

      {/* Text Input */}
      <textarea
        className="w-full h-48 p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
        placeholder="Paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        <button onClick={extractKeywords} className="px-4 py-2 bg-blue-600 text-white rounded">Keywords</button>
        <button onClick={generateSeoScore} className="px-4 py-2 bg-green-600 text-white rounded">SEO Score</button>
        <button onClick={calculateReadability} className="px-4 py-2 bg-yellow-600 text-white rounded">Readability</button>
        <button onClick={calculateWordDensity} className="px-4 py-2 bg-purple-600 text-white rounded">Word Density</button>
        <button onClick={generateWordCloud} className="px-4 py-2 bg-pink-600 text-white rounded">Word Cloud</button>
        <button
          onClick={runPlagiarismCheck}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          {loadingPlagiarism ? "Checking..." : "Plagiarism"}
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-6 space-y-6">

        {/* Keywords */}
        {keywords.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span key={k} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO Score */}
        {seoScore !== null && (
          <div>
            <h2 className="text-xl font-semibold mb-2">SEO Score</h2>
            <p className="text-3xl font-bold">{seoScore}/100</p>
          </div>
        )}

        {/* Readability */}
        {readability !== null && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Readability Score</h2>
            <p className="text-3xl font-bold">{readability}/100</p>
          </div>
        )}

        {/* Plagiarism */}
        {plagiarism && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <h2 className="text-xl font-semibold mb-2">Plagiarism Check</h2>
            <p className="text-lg font-bold">{plagiarism.score}% similarity</p>
            <p>{plagiarism.message}</p>
          </div>
        )}

        {/* Word Density */}
        {wordDensity.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Word Density</h2>
            <ul className="list-disc ml-4">
              {wordDensity.map((w) => (
                <li key={w.word}>{w.word}: {w.percent}%</li>
              ))}
            </ul>
          </div>
        )}

        {/* Word Cloud */}
        {cloud.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Word Cloud</h2>
            <div className="flex flex-wrap gap-3">
              {cloud.map((c) => (
                <span key={c.word} style={{ fontSize: c.size }} className="font-bold">
                  {c.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export */}
      <button
        className="mt-6 w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        onClick={exportPDF}
      >
        Export PDF
      </button>
    </div>
  );
}
