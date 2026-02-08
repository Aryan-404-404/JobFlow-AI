import Groq from "groq-sdk"
import asyncHandler from "express-async-handler"
import User from "../models/userSchema.js"

const getAIResponse = asyncHandler(async (req, res) => {
    // Prepare the data
    const { title, description } = req.body
    const userId = req.user._id;
    const user = await User.findById(userId)
    if (!user || !user.resumeText || user.resumeText.trim() === "") {
        return res.status(200).json({
            success: true,
            hasResume: false,
            score: 0,
            missingKeywords: ["User not found or resume missing. Sign-in and the uplaod Resume first"],
        });
    }
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
        You are a harsh but helpful ATS (Applicant Tracking System).
        
        MY RESUME:
        "${user.resumeText}"
        
        JOB DESCRIPTION:
        "${title}"
        "${description}"
        
        TASK:
        1. Give a Match Score (0-100).
        2. List 3 key missing keywords/skills.
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "score": number,
          "missingKeywords": ["skill1", "skill2", "skill3"]
        }
        `;

    // Call AI
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    })
    const result = JSON.parse(chatCompletion.choices[0].message.content)
    res.status(200).json(result)
})

const extractDetails = asyncHandler(async (req, res) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const { headerText, descriptionText } = req.body

    const prompt = `
        You are an expert Data Extraction AI.
        I will provide raw text from a LinkedIn job posting.
        
        RAW HEADER:
        "${headerText}"
        
        RAW DESCRIPTION FRAGMENT:
        "${descriptionText ? descriptionText.substring(0, 1000) : ""}..." 

        TASK:
        Extract the following fields accurately.
        1. Company Name
        2. Job Position/Title
        3. Job Type (Strictly use lowercase enum)
        4. Location (City, Country)

        STRICT RULES FOR 'type':
        - Must be one of: "full-time", "part-time", "internship", "contract", "remote"
        - If unsure or not found, default to "full-time".
        - OUTPUT MUST BE LOWERCASE.

        OUTPUT FORMAT (JSON ONLY):
        {
        "company": "String",
        "position": "String",
        "jobType": "String",
        "jobLocation": "String"
        }`

    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: "json_object" }
    })
    const result = JSON.parse(chatCompletion.choices[0].message.content)
    res.status(200).json(result)
})

export { getAIResponse, extractDetails }
