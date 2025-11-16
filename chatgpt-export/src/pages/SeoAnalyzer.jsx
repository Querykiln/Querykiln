import SeoTool from "../components/SeoTool";

export default function SeoAnalyzer() {
  return (
    <div className="max-w-5xl mx-auto bg-white text-gray-900 min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-3">SEO Analyzer</h2>

      <p className="text-gray-600 mb-6">
        Paste your content below to analyze SEO, readability, structure, keyword density, and more.
      </p>

      <SeoTool />
    </div>
  );
}
