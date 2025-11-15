import { FiMenu } from "react-icons/fi";

export default function Topbar({ openMobile }) {
  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 text-gray-700">

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden text-xl"
        onClick={openMobile}
      >
        <FiMenu />
      </button>

      <h2 className="text-lg font-semibold tracking-wide">
        Overview
      </h2>

      <div className="text-sm flex gap-4">
        <span className="opacity-70">Local AI Mode</span>
        <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
          Upgrade-ready
        </span>
      </div>
    </header>
  );
}
