import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SEOAnalyzer from "./pages/SEOAnalyzer";
import AIRewrite from "./pages/AIRewrite";
import KeywordResearch from "./pages/KeywordResearch";
import SERPPreview from "./pages/SERPPreview";
import PlagiarismChecker from "./pages/PlagiarismChecker";
import GrammarFixer from "./pages/GrammarFixer";

import useMobileSidebar from "./hooks/useMobileSidebar";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const PageMap = {
    dashboard: <Dashboard />,
    seo: <SEOAnalyzer />,
    rewrite: <AIRewrite />,
    keywords: <KeywordResearch />,
    serp: <SERPPreview />,
    plagiarism: <PlagiarismChecker />,
    grammar: <GrammarFixer />,
  };

  const { isOpen, toggleSidebar, closeSidebar } = useMobileSidebar();

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">

        {/* Mobile toggle button */}
        <button
          className="lg:hidden mb-4 px-3 py-2 bg-gray-200 rounded-md"
          onClick={toggleSidebar}
        >
          ☰ Menu
        </button>

        {PageMap[activePage]}
      </div>
    </div>
  );
}
