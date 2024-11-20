import express from 'express';
import { getDashboardData } from '../controller/dashboardController';
import authMiddleware from '../middleware/auth';

const dashboardRouter = express.Router();

dashboardRouter.get('/', authMiddleware, getDashboardData);

export default dashboardRouter;
