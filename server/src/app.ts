import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
