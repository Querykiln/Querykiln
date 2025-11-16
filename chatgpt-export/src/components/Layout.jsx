import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import useMobileSidebar from "../hooks/useMobileSidebar";

export default function Layout({ children, activePage, setActivePage }) {
  const { isOpen, open, close } = useMobileSidebar();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">

      {/* --- Mobile Sidebar Button (top-left on mobile) --- */}
      <button
        onClick={open}
        className="sm:hidden fixed top-4 left-4 z-40 bg-white p-2 rounded-md shadow-md border border-gray-200"
      >
        <svg
          className="w-6 h-6 text-gray-900"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* --- Sidebar (mobile + desktop) --- */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobile={isOpen}
        closeMobile={close}
      />

      {/* --- Main Content Wrapper --- */}
      <div className="flex flex-col flex-1">

        {/* Topbar stays fixed at top */}
        <Topbar />

        {/* --- Main Content Area --- */}
        <main className="flex-1 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
