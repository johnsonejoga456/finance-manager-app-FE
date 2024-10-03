import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js'; // JWT verification middleware

const authRouter = express.Router();

// Register a new user
authRouter.post('/signup', registerUser);

// Login user
authRouter.post('/login', loginUser);

// Get the current authenticated user
authRouter.get('/me', authMiddleware, getCurrentUser);

export default authRouter;
