import { Router } from 'express';
import {
    getQuizzes,
    getQuiz,
    updateQuiz,
} from '../../controllers/quizController';

const quizRoute = Router();
quizRoute.get('/', getQuizzes);
quizRoute.get('/:quizid', getQuiz);
quizRoute.patch('/:quizid', updateQuiz);
export default quizRoute;
