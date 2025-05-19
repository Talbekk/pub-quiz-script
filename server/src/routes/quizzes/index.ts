import { Router } from 'express';
import {
    getQuizzes,
    getQuiz,
    updateQuiz,
} from '../../controllers/quizController';
import { pagination } from '../../middlewares/pagination';

const quizRoute = Router();
quizRoute.get('/', pagination(), getQuizzes);
quizRoute.get('/:quizid', getQuiz);
quizRoute.patch('/:quizid', updateQuiz);
export default quizRoute;
