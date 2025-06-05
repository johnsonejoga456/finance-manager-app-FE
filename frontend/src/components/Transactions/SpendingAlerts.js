
export default function SpendingAlerts({ alerts, setAlerts }) {
  return (
    <div className="mb-4">
      {alerts.length > 0 && (
        <>
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-2 rounded flex justify-between items-center"
            >
              <span>{alert}</span>
              <button
                className="ml-4 text-yellow-700 hover:text-yellow-900"
                onClick={() => setAlerts(alerts.filter((_, i) => i !== idx))}
              >
                ×
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}