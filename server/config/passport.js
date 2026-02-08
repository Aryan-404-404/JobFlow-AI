import passport from "passport"; // The main auth manager
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // The specific plugin for Google
import User from "../models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

// passport.use() tells the app: "Hey, I want to use this specific login method."
passport.use(
    new GoogleStrategy(
        // -----------------------------------------------------
        // PART A: THE CONFIGURATION (The "ID Card")
        // -----------------------------------------------------
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
        },

        // -----------------------------------------------------
        // PART B: THE VERIFY FUNCTION (The "Bouncer Logic")
        // -----------------------------------------------------
        // This function runs automatically AFTER the user logs in on Google.
        // accessToken: Used if we wanted to read their emails (we don't need it now).
        // refreshToken: Used to stay logged in for years (we don't need it now).
        // profile: The massive JSON object Google sends us (Name, Email, Photo, ID).
        // done: A function we call when we are finished. It's like saying "next()".
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google Profile:", profile.emails[0].value); // Debugging log

                // Step 1: Check if this user is already in our Database
                // We check by EMAIL because that is unique.
                const existingUser = await User.findOne({ email: profile.emails[0].value });

                if (existingUser) {
                    if (!existingUser.googleId) {
                        existingUser.googleId = profile.id;
                        await existingUser.save();
                    }
                    return done(null, existingUser);
                }

                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });
                return done(null, newUser);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);