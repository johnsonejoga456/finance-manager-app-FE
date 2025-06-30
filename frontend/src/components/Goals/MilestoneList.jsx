"use client"

const MilestoneList = ({ milestones, currency = "USD" }) => {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
  }

  if (!milestones || milestones.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
        <svg className="w-6 h-6 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        <p className="text-sm text-gray-500">No milestones set</p>
        <p className="text-xs text-gray-400">Add milestones to track progress</p>
      </div>
    )
  }

  // Sort milestones by amount
  const sortedMilestones = [...milestones].sort((a, b) => a.amount - b.amount)

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Milestones</h4>
        <span className="text-xs text-gray-500">
          {milestones.filter((m) => m.achieved).length} of {milestones.length} achieved
        </span>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {sortedMilestones.map((milestone, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              milestone.achieved ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
                  milestone.achieved ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                {milestone.achieved && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${milestone.achieved ? "text-emerald-700" : "text-gray-700"}`}>
                {currencySymbols[currency]}
                {milestone.amount.toLocaleString()}
              </span>
            </div>

            {milestone.achieved && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                ✓ Achieved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MilestoneList
