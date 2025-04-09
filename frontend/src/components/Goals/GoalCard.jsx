import React, { useState } from "react";
import MilestoneList from "./MilestoneList";

const GoalCard = ({ goal, onEdit, onDelete, onMarkComplete, onUpdateProgress, onUpdateMilestones }) => {
  const [progressInput, setProgressInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
  };

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    if (progressInput && !isNaN(progressInput)) {
      onUpdateProgress(goal._id, Number(progressInput));
      setProgressInput("");
    }
  };

  const handleMilestoneSubmit = (e) => {
    e.preventDefault();
    if (milestoneInput && !isNaN(milestoneInput)) {
      const newMilestones = [...goal.milestones, { amount: Number(milestoneInput), achieved: false }];
      onUpdateMilestones(goal._id, newMilestones);
      setMilestoneInput("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{goal.title}</h2>
      <p className="text-sm text-gray-500 mb-2">Category: <span className="font-medium">{goal.category}</span></p>
      {goal.description && (
        <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">{goal.description}</p>
      )}

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {currencySymbols[goal.currency]}{goal.currentAmount} / {currencySymbols[goal.currency]}{goal.targetAmount} ({goal.progress}%)
        </p>
      </div>

      <MilestoneList milestones={goal.milestones} />

      <div className="flex flex-col gap-3 mt-4">
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
        <form onSubmit={handleMilestoneSubmit} className="flex gap-2 items-center">
          <input
            type="number"
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            placeholder="Add milestone"
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition"
          >
            Add
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