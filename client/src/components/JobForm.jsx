import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useJob } from '../context/JobContext';

export default function JobForm({ addJob, setAddJob, setToast, currentJob, setCurrentJob }) {

    const { createJob, updateJob } = useJob();
    const [form, setForm] = useState({
        company: "",
        position: "",
        status: "pending",
        jobType: "full-time",
        link: "",
        jobLocation: "",
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (currentJob) {
            setForm({
                company: currentJob.company,
                position: currentJob.position,
                status: currentJob.status,
                jobType: currentJob.jobType,
                jobLocation: currentJob.jobLocation
            });
        } else {
            setForm({
                company: "",
                position: "",
                status: "pending",
                jobType: "full-time",
                link: "",
                jobLocation: "",
            });
        }
    }, [currentJob]);

    const handleSubmit = async () => {
        if (!form.company || !form.position) {
            setToast({message: "Please fill all required fields", type: "error"})
            return;
        }
        let res;
        if (currentJob) {
            res = await updateJob(currentJob._id, form);
            if (res.success) {
                setToast({message: "Job Updated Successfully!", type: "success"})
                setCurrentJob(null)
                setAddJob(false);
            }
        }
        else {
            res = await createJob(form);
            if (res.success) {
                setToast({message: "Job Successfully Added!", type: "success"})
                setAddJob(false);
            }
        }
        if (!res.success) {
            setToast({message: res.err, type: "error"})
        }
        setTimeout(() => {
            setToast("");
        }, 3000);
    }

    return (
        <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"></div>
            
            {/* Sliding Panel */}
            <div className="fixed top-20 left-0 right-0 z-50 animate-slide-down max-w-7xl mx-auto sm:px-6 lg:px-8 py-6 rounded-2xl ">
                <div className="bg-[#141414] border-b border-[#2A2A2A] shadow-2xl">
                    {/* Header */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4 border-b border-[#1E1E1E]">
                            <h2 className="text-2xl font-bold text-white">Add New Job Application</h2>
                            <button 
                                onClick={() => setAddJob(!addJob)} 
                                className="text-[#9CA3AF] hover:text-white hover:bg-[#1E1E1E] p-2 rounded-lg transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Company Name <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={form.company}
                                    type="text"
                                    name="company"
                                    placeholder="e.g., Google, Meta, Amazon"
                                    maxLength="50"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                />
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Position <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={form.position}
                                    type="text"
                                    name="position"
                                    placeholder="e.g., Senior Frontend Developer"
                                    maxLength="100"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Status <span className="text-[#EF4444]">*</span>
                                </label>
                                <select
                                    onChange={handleChange}
                                    value={form.status}
                                    name="status"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="pending" className="bg-[#141414]">Pending</option>
                                    <option value="interview" className="bg-[#141414]">Interview</option>
                                    <option value="rejected" className="bg-[#141414]">Rejected</option>
                                    <option value="offer" className="bg-[#141414]">Offer</option>
                                </select>
                            </div>

                            {/* Job Type */}
                            <div>
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Job Type <span className="text-[#EF4444]">*</span>
                                </label>
                                <select
                                    onChange={handleChange}
                                    value={form.jobType}
                                    name="jobType"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="full-time" className="bg-[#141414]">Full-Time</option>
                                    <option value="part-time" className="bg-[#141414]">Part-Time</option>
                                    <option value="remote" className="bg-[#141414]">Remote</option>
                                    <option value="internship" className="bg-[#141414]">Internship</option>
                                </select>
                            </div>

                            {/* URL */}
                            <div>
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    URL
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={form.link}
                                    type="text"
                                    name="link"
                                    placeholder="https://example.com/job-posting"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                />
                            </div>

                            {/* Job Location */}
                            <div>
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Job Location
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={form.jobLocation}
                                    type="text"
                                    name="jobLocation"
                                    placeholder="e.g., Remote, New York, San Francisco"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-[#6B7280] mt-3">Leave location empty to set as "Unknown"</p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-[#1E1E1E]">
                            <button 
                                onClick={() => setAddJob(!addJob)} 
                                className="px-6 py-2.5 border border-[#2A2A2A] hover:bg-[#1E1E1E] text-white rounded-lg font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-all"
                            >
                                Add Job Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}