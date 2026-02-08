import Job from "../models/jobSchema.js"
import asyncHandler from "express-async-handler"

const createJob = asyncHandler(async (req, res) => {
    const { company, position, jobLocation, status, link, jobType, description } = req.body;
    if (!company || !position) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const job = await Job.create({
        company,
        position,
        jobLocation,
        status,
        link,
        jobType,
        description,
        createdBy: req.user._id
    })
    res.status(201).json({ job, message: "Job Created!" });
})

const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
        jobs, count: jobs.length
    })
})

const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, createdBy: req.user._id })
    if (!job) {
        return res.status(404).json({ message: `No job with id ${id}` });
    }
    res.status(200).json({ message: "Success! Job removed" })
})

const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { company, position, status } = req.body;
    if (!company || !position) {
        return res.status(400).json({ message: 'Please provide all values' });
    }
    const job = await Job.findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!job) {
        return res.status(404).json({ message: `No job found with id ${id}` });
    }
    res.status(200).json({ job, message: "Success! Job Updated" })
})

export { createJob, getAllJobs, deleteJob, updateJob }