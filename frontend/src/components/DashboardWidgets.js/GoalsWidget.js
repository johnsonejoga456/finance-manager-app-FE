import React, { useEffect, useState } from "react";
import { fetchGoals } from "../../api/goals";
import { useNavigate } from "react-router-dom";

const GoalsWidget = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const data = await fetchGoals();
                setGoals(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching goals:", error);
                setLoading(false);
            }
        };

        loadGoals();
    }, []);

    // Calculate metrics
    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.progress >= 100).length;
    const activeGoals = totalGoals - completedGoals;
    const upcomingDeadlines = goals.filter((goal) => {
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Goals Overview</h3>
            {loading ? (
                <p>Loading goals...</p>
            ) : (
                <div>
                    <p>Total Goals: {totalGoals}</p>
                    <p>Active Goals: {activeGoals}</p>
                    <p>Completed Goals: {completedGoals}</p>
                    <p>Upcoming Deadlines: {upcomingDeadlines.length}</p>
                    <button
                        onClick={() => navigate("/dashboard/goals")}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        View All Goals
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoalsWidget;
