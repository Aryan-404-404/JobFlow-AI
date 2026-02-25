import {getAIResponse, extractDetails, generateColdEmail} from "../controllers/aiController.js";
import authmiddleware from "../middlewares/authmiddleware.js"
import express from "express"

const router = express.Router()

router.post('/response', authmiddleware, getAIResponse)
router.post('/extract', authmiddleware, extractDetails)
router.post('/generateEmail', authmiddleware, generateColdEmail)

export default router