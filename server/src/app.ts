import express from 'express';
import cors from 'cors';
import indexRoute from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', indexRoute);
app.use(errorHandler);

export default app;
