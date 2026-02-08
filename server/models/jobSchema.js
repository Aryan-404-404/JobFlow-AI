import mongoose from "mongoose"

const jobSchema = mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 50
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['pending', 'interview', 'rejected', 'offer'], // These control your badges
    default: 'pending'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'internship'],
    default: 'full-time',
    lowercase: true,
    trim: true
  },
  jobLocation: {
    type: String,
    default: 'Unknown'
  },
  link: { 
    type: String 
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // 🔗 Link every job to a specific User
    required: [true, 'Please provide user']
  }
}, { timestamps: true })

export default mongoose.model('Job', jobSchema)