import { Router } from 'express';
import participantRoute from './participants';

// Index
const indexRoute = Router();

indexRoute.get('/', async (req, res) => {
    res.json({ message: 'Welcome User' });
});

indexRoute.use('/participants', participantRoute);

export default indexRoute;
