import React from "react";

const MilestoneList = ({ milestones }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Milestones</h3>
      <ul className="list-disc list-inside">
        {milestones.map((milestone, index) => (
          <li key={index} className="text-gray-600">
            {milestone.name} - {milestone.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MilestoneList;
