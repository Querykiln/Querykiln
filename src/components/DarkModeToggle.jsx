export default function DarkModeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded-lg bg-black text-white dark:bg-gray-200 dark:text-black"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
