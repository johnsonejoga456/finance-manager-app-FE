import React from "react";

const GoalCard = ({ goal, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">{goal.name}</h2>
      <p className="text-gray-600 mb-4">{goal.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Target: {goal.targetAmount} {goal.currency}
          </span>
          <span className="text-sm text-gray-500">
            Progress: {goal.currentAmount} {goal.currency}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => onEdit(goal)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => onDelete(goal.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
