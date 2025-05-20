import { Router } from 'express';
import { login, logout } from '../../controllers/authController';

const authRoute = Router();

authRoute.post('/login', login);
authRoute.post('/logout', logout);

export default authRoute;
