import { Router } from 'express';
import participantRoute from './participants';
import quizRoute from './quizzes';

// Index
const indexRoute = Router();

indexRoute.get('/', async (req, res) => {
    res.json({ message: 'Welcome User' });
});

indexRoute.use('/participants', participantRoute);
indexRoute.use('/quizzes', quizRoute);

export default indexRoute;
