import { Router } from 'express';
import { getQuizzes, getQuiz } from '../../controllers/quizController';

const quizRoute = Router();
quizRoute.get('', getQuizzes);
quizRoute.get('/:userid', getQuiz);
export default quizRoute;
