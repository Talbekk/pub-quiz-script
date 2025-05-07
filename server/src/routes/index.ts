import { Router } from 'express';
import participantRoute from './participants';
import quizRoute from './quizzes';
import entryRoute from './entries';

const indexRoute = Router();

indexRoute.get('/', async (req, res) => {
    res.json({ message: 'Welcome User' });
});

indexRoute.use('/participants', participantRoute);
indexRoute.use('/quizzes', quizRoute);
indexRoute.use('/entries', entryRoute);

export default indexRoute;
