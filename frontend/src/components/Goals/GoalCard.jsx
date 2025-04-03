import React, { useState } from "react";

const GoalCard = ({ goal, onEdit, onDelete, onMarkComplete, onUpdateProgress }) => {
  const [progressInput, setProgressInput] = useState("");

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    if (progressInput && !isNaN(progressInput)) {
      onUpdateProgress(goal._id, Number(progressInput));
      setProgressInput("");
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">{goal.title}</h2>
      <p className="text-gray-600 mb-2">Category: {goal.category}</p>
      <p className="text-gray-600 mb-4">{goal.description || "No description"}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">
          Progress: ${goal.currentAmount} / ${goal.targetAmount} ({goal.progress}%)
        </p>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold">Milestones:</h3>
          <ul className="list-disc pl-4">
            {goal.milestones.map((m, index) => (
              <li key={index} className={`text-sm ${m.achieved ? "text-green-500" : "text-gray-500"}`}>
                ${m.amount} {m.achieved ? "(Achieved)" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <form onSubmit={handleProgressSubmit} className="flex gap-2">
            <input
              type="number"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              placeholder="Update amount"
              className="p-1 border rounded w-24"
            />
            <button type="submit" className="text-blue-500 hover:underline">
              Update
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2">
          {goal.status === "in-progress" && (
            <button
              className="text-green-500 hover:underline"
              onClick={() => onMarkComplete(goal._id)}
            >
              Mark Complete
            </button>
          )}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => onEdit(goal)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => onDelete(goal._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;