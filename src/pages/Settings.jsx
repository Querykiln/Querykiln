export default function Settings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Settings</h2>
      <p className="text-sm text-gray-500 mb-4">
        Here you will later add AI mode selection and optional API keys.
      </p>
      <div className="bg-white rounded-xl shadow-sm p-4 text-sm text-gray-600 space-y-3">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
            AI Mode
          </div>
          <p className="text-sm">
            Currently using <strong>Local AI Simulation</strong>. In future you can switch
            to <strong>Real AI (LLM)</strong> by adding an API key here.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
            API Key (future)
          </div>
          <input
            className="border rounded px-3 py-2 w-full text-sm"
            placeholder="sk-******************** (disabled for now)"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
