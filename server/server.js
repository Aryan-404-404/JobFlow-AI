import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"

import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import authRoutes from "./routes/authRoutes.js";

import errorHandler from "./middlewares/errorHandler.js"
import "./config/passport.js";

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173", "chrome-extension://iifjoheiblphehnnaoepjfpbcgemcmgi"
],
    credentials: true
}))
app.set("trust proxy", 1);

app.use(cookieParser())
app.use(express.json());

app.use('/user', userRoutes)
app.use('/job', jobRoutes)
app.use('/ai', aiRoutes)
app.use("/api/auth", authRoutes);

app.use(errorHandler)

app.get('/', (req, res)=>{
    res.send('API is running...')
})
app.get('/ping', (req, res)=>{
    res.send('pong')
})
app.listen(PORT, ()=>{
    console.log(`Server running at PORT ${PORT}`);
})
