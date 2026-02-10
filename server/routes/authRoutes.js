import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`
    }),
    (req, res) => {
        console.log('========== OAUTH CALLBACK HIT ==========');
        console.log('✅ User authenticated:', req.user?.email);
        console.log('📧 User ID:', req.user?._id);
        console.log('🌍 CLIENT_URL:', process.env.CLIENT_URL);
        
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        
        console.log('🔑 JWT Token created (first 20 chars):', token.substring(0, 20) + '...');
        
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None',
        //     maxAge: 30 * 24 * 60 * 60 * 1000,
        //     path: '/'
        // });
        
        // console.log('🍪 Cookie set with: httpOnly=true, secure=true, sameSite=None');
        // console.log('🔄 Redirecting to:', process.env.CLIENT_URL);
        // console.log('==========================================');
        
        // res.redirect(process.env.CLIENT_URL || "http://localhost:5173/");   
        console.log('🔄 Redirecting to callback page with token');
        
        // ✅ Pass token in URL (temporary, will be consumed immediately)
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
);

export default router;