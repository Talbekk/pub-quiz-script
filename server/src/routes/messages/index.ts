import { Router } from 'express';
import { getMessage, getMessages } from '../../controllers/messageController';

const messageRoute = Router();
messageRoute.get('/', getMessages);
messageRoute.get('/:messageid', getMessage);
export default messageRoute;
