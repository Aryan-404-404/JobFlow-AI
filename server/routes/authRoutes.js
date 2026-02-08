import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
    "/google",
    // passport.authenticate("google") tells Passport:
    // "Take over! Send this user to the Google Login Page."
    passport.authenticate("google", {
        // scope: What data do we want?
        // "profile" = Name, Photo, ID
        // "email" = Their email address
        scope: ["profile", "email"],

        // session: false because we use JWTs, not server sessions
        session: false
    })
);

// ROUTE B: THE ARRIVAL GATE 🛬
// URL: /api/auth/google/callback
router.get(
    "/google/callback",

    // 1. THE SECURITY CHECK
    // Passport grabs the code from the URL, talks to Google, 
    // and runs that "Strategy" function we wrote earlier.
    // If it fails, we kick them back to "/login".
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'None',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.redirect(process.env.CLIENT_URL || "http://localhost:5173/");   
    }
);

export default router;