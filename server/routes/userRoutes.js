import express from "express"
import authMiddleware from "../middlewares/authmiddleware.js"
import {getUser, login, register, updateUser, logOut, getResume, updateResume} from "../controllers/userController.js"

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('/info',authMiddleware, getUser)
router.put('/update/:id',authMiddleware, updateUser)
router.post('/logout',authMiddleware, logOut)
router.get('/resume', authMiddleware, getResume)
router.put('/resume', authMiddleware, updateResume)

export default router