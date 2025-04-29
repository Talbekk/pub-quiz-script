import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import itemRoutes from './routes/itemRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use('/items', itemRoutes);
app.use(errorHandler);
app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

export default app;
