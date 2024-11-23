import Goal from '../models/Goal.js';

// Create a new goal
export const createGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline } = req.body;

        const goal = new Goal({
            title,
            targetAmount,
            deadline,
            milestones,
            user: req.user.id, // Add the authenticated user ID
        });

        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all goals for the authenticated user
export const getGoals = async (req, res) => {
    try {
        const { sortBy, filterBy } = req.query;

        let query = { user: req.user.id };
        
        if (filterBy === 'completed') {
            query = { ...query, progress: { $lt: 100 } };
        } else if (filterBy === 'incomplete') {
            query = { ...query, progress: { $lt: 100} };
        }

        let goals = Goal.find(query);

        if (sortBy === 'progress') {
            goals = goals.sort({ progress: -1 }); // Descending order
        } else if (sortBy === 'deadline') {
            goals = goals.sort({ deadline: 1 }); // Ascending order
        }

        res.status(200).json(await goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a goal
export const updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, targetAmount, currentAmount, deadline, milestones } = req.body;

        const goal = await Goal.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, targetAmount, currentAmount, deadline, milestones },
            { new: true } // Return the updated document
        );

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Mark milestones as achieved if `currrentAmount` meets the milestone amount
        goal.milestones.forEach(milestone => {
            if (currentAmount >= milestone.amount) milestone.achieved = true;
        });

        await goal.save();

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Users get notified

export const getNotifications = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });

        const notifications = goals.reduce((acc, goal) => {
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            if (daysLeft <= 7 && daysLeft > 0) {
                acc.push({ message: `Goal "${goal.title}" is due in ${daysLeft} days.` });
            }

            if (goal.progress >= 100) {
                acc.push({ message: `Congratulations! You've completed the goal "${goal.title}".` });
            }

            return acc;
        }, []);

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a goal
export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
