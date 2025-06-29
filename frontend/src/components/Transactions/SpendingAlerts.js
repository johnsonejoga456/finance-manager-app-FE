"use client"

export default function SpendingAlerts({ alerts, setAlerts }) {
  return (
    <div className="mb-6">
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-amber-50 border-l-4 border-amber-400 text-amber-800 p-4 rounded-lg shadow-sm flex justify-between items-center transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium text-sm">{alert}</span>
              </div>
              <button
                className="ml-4 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full p-1 transition-colors duration-150"
                onClick={() => setAlerts(alerts.filter((_, i) => i !== idx))}
                aria-label="Dismiss alert"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}