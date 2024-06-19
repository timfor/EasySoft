// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { User } from "../models/relations.js";

dotenv.config();
const key_jwt = process.env.jwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key_jwt,
};
export default function passportMiddleware(passport) {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findByPk(payload.userId);
        if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
}
