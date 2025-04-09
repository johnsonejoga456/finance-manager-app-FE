import React from "react";

const MilestoneList = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="mt-4 text-gray-500 text-sm">
        No milestones set yet.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Milestones</h3>
      <ul className="space-y-2">
        {milestones.map((milestone, index) => (
          <li
            key={index}
            className={`flex items-center justify-between text-sm p-2 rounded-lg ${
              milestone.achieved ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"
            }`}
          >
            <span>
              ${milestone.amount.toLocaleString()}
              {milestone.achieved && (
                <span className="ml-2 text-xs font-medium text-green-600">✓ Achieved</span>
              )}
            </span>
            {/* Optional: Add a visual indicator */}
            <span className={`w-2 h-2 rounded-full ${milestone.achieved ? "bg-green-500" : "bg-gray-300"}`}></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MilestoneList;