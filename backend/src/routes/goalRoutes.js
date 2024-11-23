import express from 'express';
import {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
} from '../controllers/goalController.js';

import authMiddleware from '../middleware/auth.js'; // Ensure user is authenticated

const goalRouter = express.Router();

// Create a new goal
goalRouter.post('/', authMiddleware, createGoal);

// Get all goals for the authenticated user
goalRouter.get('/', authMiddleware, getGoals);

// Update a goal
goalRouter.put('/:id', authMiddleware, updateGoal);

// Fetch notifications
goalRouter.get('/notifications', authMiddleware, getNotifications);


// Delete a goal
goalRouter.delete('/:id', authMiddleware, deleteGoal);

export default goalRouter;
