import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function Charts() {
  const seoTrendData = [
    { week: "Week 1", score: 65 },
    { week: "Week 2", score: 68 },
    { week: "Week 3", score: 72 },
    { week: "Week 4", score: 78 },
  ];

  const keywordData = [
    { keyword: "seo tool", volume: 1200, difficulty: 30 },
    { keyword: "ai rewrite", volume: 900, difficulty: 45 },
    { keyword: "serp checker", volume: 600, difficulty: 40 },
    { keyword: "plagiarism", volume: 1500, difficulty: 20 },
  ];

  return (
    <div className="space-y-10">

      {/* SEO Score Trend */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">SEO Score Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={seoTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Keyword Performance */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Keyword Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywordData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="keyword" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="volume" fill="#10b981" />
            <Bar dataKey="difficulty" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
