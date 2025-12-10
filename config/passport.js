import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserById, findUserByUsername } from "../models/users.js";

const strategy = new LocalStrategy(
  { usernameField: "username", passwordField: "password" },
  async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "User or password incorrect" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return done(null, false, { message: "User or password incorrect" });
      }

      const userNoPass = { ...user };
      delete userNoPass.passwordHash;
      return done(null, userNoPass);
    } catch (error) {
      console.error("Passport: Error:", error);
      done(error);
    }
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.passwordHash;
      done(null, userWithoutPassword);
    } else {
      done(null, false);
    }
  } catch (error) {
    console.error("DESERIALIZE USER - Error:", error);
    done(error);
  }
});

export default passport;
