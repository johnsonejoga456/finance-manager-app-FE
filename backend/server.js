import express from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import notificationRouter from './src/routes/notificationRoutes.js';
import authRouter from './src/routes/authRoutes.js'; // Auth routes
import transactionRouter from './src/routes/transactionRoutes.js'; // Transaction routes
import errorHandler from './src/errorHandler.js'; // Error handler middleware
import http from 'http'; // Required for Socket.IO
import { Server } from 'socket.io'; // Importing Socket.IO

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions)); // Use the CORS middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(handleValidationErrors); // Add validation error handling middleware

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
// Routes
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/notifications', notificationRouter);

// Socket.IO real-time notifications
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Emit test notification every 60 seconds
  setInterval(() => {
    socket.emit('transactionReminder', { message: 'You have a new recurring transaction!' });
  }, 60000);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
