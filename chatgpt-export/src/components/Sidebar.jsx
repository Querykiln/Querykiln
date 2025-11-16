import {
  FiGrid,
  FiCpu,
  FiEdit3,
  FiSearch,
  FiTrendingUp,
  FiCopy,
  FiZap,
} from "react-icons/fi";

export default function Sidebar({ activePage, setActivePage }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: <FiGrid /> },
    { id: "seo", label: "SEO Analyzer", icon: <FiCpu /> },
    { id: "rewrite", label: "AI Rewrite", icon: <FiEdit3 /> },
    { id: "keywords", label: "Keyword Research", icon: <FiSearch /> },
    { id: "serp", label: "SERP Preview", icon: <FiTrendingUp /> },
    { id: "plagiarism", label: "Plagiarism Checker", icon: <FiCopy /> },
    { id: "grammar", label: "Grammar Fixer", icon: <FiZap /> },
  ];

  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200 p-6">
      <h1 className="text-xl font-bold mb-8">SEO Toolkit</h1>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`
              flex items-center gap-3 w-full px-3 py-2 rounded-md text-left font-medium
              ${
                activePage === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
