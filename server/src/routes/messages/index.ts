import { Router } from 'express';
import { getMessage, getMessages } from '../../controllers/messageController';
import { pagination } from '../../middlewares/pagination';

const messageRoute = Router();
messageRoute.get('/', pagination(), getMessages);
messageRoute.get('/:messageid', getMessage);
export default messageRoute;
