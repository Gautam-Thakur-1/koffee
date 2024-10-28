import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';

// import all routes
import userRouter from './routes/user';



// version 1
app.use('/api/v1/user', userRouter);






app.use(express.json());
app.use(cookieParser());

module.exports = app;