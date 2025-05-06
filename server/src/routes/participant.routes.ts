import { Router } from 'express';
import {
    getParticipant,
    getParticipants,
} from '../controllers/participantController';

const participantRoute = Router();
participantRoute.get('', getParticipants);
participantRoute.get('/:userid', getParticipant);
export default participantRoute;
