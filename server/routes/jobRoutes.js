import express from "express"
import { createJob, getAllJobs, deleteJob, updateJob} from "../controllers/jobController.js"
import authMiddleware from "../middlewares/authmiddleware.js"

const router = express.Router()

router.post('/createJob',authMiddleware, createJob)
router.get('/AllJobs',authMiddleware, getAllJobs)
router.delete('/deleteJob/:id',authMiddleware, deleteJob)
router.patch('/updateJob/:id',authMiddleware, updateJob)

export default router