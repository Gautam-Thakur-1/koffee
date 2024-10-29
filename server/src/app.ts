import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';

const app = express();
import cookieParser from 'cookie-parser';

// Apply middleware first
app.use(express.json());
app.use(cookieParser());

// Import routes after applying middleware
import userRouter from './routes/user-routes';



// Define routes after middleware
app.use('/api/v1/user', userRouter);


module.exports = app;
