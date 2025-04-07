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
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{goal.title}</h2>
      <p className="text-sm text-gray-500 mb-1">Category: <span className="font-medium">{goal.category}</span></p>
      <p className="text-gray-600 text-sm mb-4">{goal.description || "No description"}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ${goal.currentAmount} / ${goal.targetAmount} ({goal.progress}%)
        </p>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Milestones</h3>
          <ul className="mt-1 space-y-1">
            {goal.milestones.map((m, index) => (
              <li
                key={index}
                className={`text-xs ${m.achieved ? "text-green-600" : "text-gray-500"}`}
              >
                ${m.amount} {m.achieved && <span className="text-green-500">(Achieved)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <form onSubmit={handleProgressSubmit} className="flex gap-2 items-center">
          <input
            type="number"
            value={progressInput}
            onChange={(e) => setProgressInput(e.target.value)}
            placeholder="Add amount"
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition"
          >
            Update
          </button>
        </form>
        <div className="flex gap-2 justify-end">
          {goal.status === "in-progress" && (
            <button
              onClick={() => onMarkComplete(goal._id)}
              className="text-green-600 hover:text-green-700 text-sm font-medium transition"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={() => onEdit(goal)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;