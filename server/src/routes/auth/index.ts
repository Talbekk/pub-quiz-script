import { Router } from 'express';
import passport from 'passport';

const authRoute = Router();

authRoute.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
});

authRoute.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logged out' });
    });
});

export default authRoute;