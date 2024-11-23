import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../../api/goals';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    milestones: [{ amount: '', achieved: false }],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Socket initialization for real-time updates
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('goalUpdated', () => {
      fetchGoalsList(); // Refresh goals list on updates
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoalsList();
  }, []);

  const fetchGoalsList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGoals();
      setGoals(data);
      setError('');
    } catch (err) {
      setError('Failed to load goals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMilestoneChange = (index, value) => {
    const updatedMilestones = [...newGoal.milestones];
    updatedMilestones[index].amount = value;
    setNewGoal((prev) => ({
      ...prev,
      milestones: updatedMilestones,
    }));
  };

  const toggleMilestoneAchieved = async (goalId, milestoneIndex) => {
    try {
      const updatedGoal = await updateGoal(goalId, {
        action: 'toggleMilestone',
        milestoneIndex,
      });
      setGoals((prev) =>
        prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
      );
      setError('');
    } catch (err) {
      setError('Failed to update milestone. Please try again.');
    }
  };

  const addMilestone = () => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { amount: '', achieved: false }],
    }));
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      setError('Please provide a title, target amount, and deadline.');
      return;
    }

    try {
      const createdGoal = await createGoal(newGoal);
      setGoals([...goals, createdGoal]);
      setNewGoal({
        title: '',
        targetAmount: '',
        deadline: '',
        milestones: [{ amount: '', achieved: false }],
      });
      setError('');
    } catch (err) {
      setError('Failed to create goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((goal) => goal._id !== goalId));
      setError('');
    } catch (err) {
      setError('Failed to delete goal. Please try again.');
    }
  };

  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-green-500 h-4 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Goals</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add New Goal */}
      <div className="mb-6 p-4 border rounded bg-white">
        <h2 className="font-semibold mb-2">Add New Goal</h2>
        <input
          type="text"
          className="p-2 border rounded w-full mb-2"
          placeholder="Title"
          name="title"
          value={newGoal.title}
          onChange={handleInputChange}
        />
        <input
          type="number"
          className="p-2 border rounded w-full mb-2"
          placeholder="Target Amount"
          name="targetAmount"
          value={newGoal.targetAmount}
          onChange={handleInputChange}
        />
        <input
          type="date"
          className="p-2 border rounded w-full mb-2"
          placeholder="Deadline"
          name="deadline"
          value={newGoal.deadline}
          onChange={handleInputChange}
        />
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Milestones</h3>
          {newGoal.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="number"
                className="p-2 border rounded flex-grow"
                placeholder={`Milestone ${index + 1} Amount`}
                value={milestone.amount}
                onChange={(e) => handleMilestoneChange(index, e.target.value)}
              />
            </div>
          ))}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={addMilestone}
          >
            Add Milestone
          </button>
        </div>
        <button
          onClick={handleCreateGoal}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Goal
        </button>
      </div>

      {/* Goals List */}
      {isLoading ? (
        <p>Loading goals...</p>
      ) : goals.length === 0 ? (
        <p>No goals yet. Start by adding one!</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li
              key={goal._id}
              className="p-4 border-b flex flex-col gap-2 bg-white rounded shadow-sm mb-4"
            >
              <h3 className="font-semibold">{goal.title}</h3>
              <p>
                Target: ${goal.targetAmount}, Current: ${goal.currentAmount}
              </p>
              <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              {renderProgressBar(goal.progress)}
              <ul className="mt-2">
                {goal.milestones.map((milestone, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>
                      Milestone {index + 1}: ${milestone.amount}
                    </span>
                    <button
                      className={`px-2 py-1 rounded ${
                        milestone.achieved
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                      onClick={() =>
                        toggleMilestoneAchieved(goal._id, index)
                      }
                    >
                      {milestone.achieved ? 'Achieved' : 'Mark as Achieved'}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 self-start"
                onClick={() => handleDeleteGoal(goal._id)}
              >
                Delete Goal
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Goals;
