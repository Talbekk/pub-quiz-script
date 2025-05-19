import passport from 'passport';
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from '../client';


passport.use("local", new Strategy(
    async (username, password, done) => {
      try {
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });