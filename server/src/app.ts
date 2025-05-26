import express from 'express';
import cors from 'cors';
import indexRoute from './routes';
import { errorHandler } from './middlewares/errorHandler';
import session from 'express-session';
import passport from 'passport';
import './config/passport';

const app = express();

app.use(
    session({
        secret: process.env.SESSION_TOKEN!,
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRoute);
app.use(errorHandler);

export default app;
