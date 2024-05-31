// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { UserModel } from "../models/Users.js";

dotenv.config();
const key_jwt = process.env.jwt;
const SQLITEURL = process.env.SQLITEURL;
const userModel = new UserModel(SQLITEURL);

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key_jwt,
};
export default function passportMiddleware(passport) {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await userModel.getUserByParameter(
          "user_id",
          payload.userId
        );
        console.log(user);
        if (user.row != null) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
}
