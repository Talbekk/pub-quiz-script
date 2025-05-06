import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import indexRoute from './routes'; // Import the indexRoute
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(errorHandler);
app.use(cors());
app.use(express.json());
app.use('/', indexRoute); // Use the indexRoute for the root path

export default app;
