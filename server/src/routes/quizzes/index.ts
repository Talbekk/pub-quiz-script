import { Router } from 'express';
import {
    getQuizzes,
    getQuiz,
    updateQuiz,
} from '../../controllers/quizController';
import { pagination } from '../../middlewares/pagination';
import { isAuthenticated } from '../../middlewares/auth';

const quizRoute = Router();
quizRoute.get('/', pagination(), getQuizzes);
quizRoute.get('/:quizid', getQuiz);
quizRoute.patch('/:quizid', isAuthenticated, updateQuiz);
export default quizRoute;
