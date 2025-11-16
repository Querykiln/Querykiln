import Charts from "../components/Charts";

export default function Dashboard() {
  return (
    <div className="text-gray-900">

      <p className="text-gray-600 mb-8">
        All-in-one on-page SEO, content, and analysis dashboard.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="SEO Health" value="78 / 100" />
        <StatCard label="Content Pieces" value="12" />
        <StatCard label="Analyzed this week" value="34" />
        <StatCard label="AI Actions" value="Rewrites & Suggestions" />
      </div>

      {/* Getting Started */}
      <h3 className="text-xl font-bold mb-4">Getting Started</h3>

      <ol className="list-decimal ml-6 space-y-2 text-gray-700 mb-12">
        <li>Go to <b>SEO Analyzer</b> and paste your content.</li>
        <li>Use <b>AI Rewrite</b> to polish it.</li>
        <li>Check <b>Keywords & SERP Preview</b>.</li>
        <li>Optionally compare with <b>Competitors</b>.</li>
      </ol>

      {/* 📊 Charts Section */}
      <Charts />

    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm text-center">
      <div className="text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
