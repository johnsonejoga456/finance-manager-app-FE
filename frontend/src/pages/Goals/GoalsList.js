import React, { useEffect, useState } from 'react';
import { fetchGoals } from '../../api/goals';
import GoalCard from '../../components/Goals/GoalCard';

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await fetchGoals();
        setGoals(data);
      } catch (err) {
        setError('Failed to fetch goals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Goals</h2>
      {goals.length === 0 ? (
        <p>No goals found. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsList;
