import asyncHandler from "express-async-handler"
import User from "../models/userSchema.js"
import jwt from "jsonwebtoken"

const generateToken = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    )
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400);
        throw new Error("User already exists!")
    }
    const user = await User.create({ name, email, password })
    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data');
    }
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        res.status(404)
        throw new Error("User not found! Please register first!")
    }
    if (!await user.matchPassword(password)) {
        res.status(401)
        throw new Error("Wrong password!")
    }
    else {
        generateToken(res, user._id)
        res.status(200).json({
            userId: user._id,
            name: user.name,
            email: email,
        })
    }
})

const getUser = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        res.status(404)
        throw new Error("User not found!")
    }
    res.status(200).json({
        userId: user._id,
        name: user.name,
        email: user.email,
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()       //we are using .save() instead of findByIdAndUpdate cuz using it, it will skip the presave middlware in schema
        res.status(200).json({
            userId: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        })
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
})

const logOut = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'None'
    })
    res.status(200).json({ message: "Logged out successfully!" })
})

const getResume = asyncHandler(async (req, res) => {
    const user = req.user;
    res.status(200).json({ resume: user.resumeText })
})
const updateResume = asyncHandler(async (req, res) => {
    const { resumeText } = req.body;
    if (resumeText === undefined) {
        res.status(400);
        throw new Error("Resume text is required");
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { resumeText },
        { new: true }
    );

    if (user) {
        res.status(200).json({
            message: "Resume updated successfully!",
            resumeText: user.resumeText
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

export { login, register, getUser, updateUser, logOut, getResume, updateResume }