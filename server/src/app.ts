import express from 'express';
import cors from 'cors';
import indexRoute from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(errorHandler);
app.use(cors());
app.use(express.json());
app.use('/', indexRoute);

export default app;
