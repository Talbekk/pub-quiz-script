import { Router } from 'express';
import participantRoute from './participants';
import quizRoute from './quizzes';
import entryRoute from './entries';
import messageRoute from './messages';
import authRoute from './auth';

const indexRoute = Router();

indexRoute.get('/', async (req, res) => {
    res.json({ message: 'Welcome User' });
});

indexRoute.use('/auth', authRoute);
indexRoute.use('/participants', participantRoute);
indexRoute.use('/quizzes', quizRoute);
indexRoute.use('/entries', entryRoute);
indexRoute.use('/messages', messageRoute);

export default indexRoute;
