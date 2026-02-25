import api from "../config/axios";
import { ChevronLeft } from 'lucide-react';

const Form = ({form, setForm, message, setMessage, loading, setLoading, description, setDescription, setView}) => {

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await api.post('/job/createJob', { ...form, description: description });
            if (res.status === 200 || res.status === 201) {
                setMessage({ text: "✅ Job Saved Successfully!", type: "success" });
                console.log("✅ Job Saved Successfully!", res.data)
                setForm({
                    company: "",
                    position: "",
                    status: "pending",
                    jobType: "full-time",
                    link: "",
                    jobLocation: "",
                });
                setDescription("");
            }
        } catch (err) {
            console.log(err);
            setMessage({ text: `❌ Error: ${err.response?.data?.message || "Failed to save"}`, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center mb-4">
                <button
                    onClick={() => { setView('menu'); setMessage(null); }}
                    className="p-1 hover:bg-[#1E1E1E] rounded text-[#9CA3AF] hover:text-white transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-lg font-bold ml-2 text-white">Add Manually</h2>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success'
                    ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30"
                    : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Job Link */}
                <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1 uppercase font-medium">Job Link</label>
                    <input
                        type="text"
                        name="link"
                        value={form.link}
                        onChange={handleChange}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-[#10B981] outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        placeholder="https://..."
                    />
                </div>

                {/* Company & Position */}
                <div className="flex gap-3">
                    <div className="w-1/2">
                        <label className="block text-xs text-[#9CA3AF] mb-1 uppercase font-medium">Company</label>
                        <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-white outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs text-[#9CA3AF] mb-1 uppercase font-medium">Position</label>
                        <input
                            type="text"
                            name="position"
                            value={form.position}
                            onChange={handleChange}
                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-white outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Type & Status */}
                <div className="flex gap-3">
                    <div className="w-1/2">
                        <label className="block text-xs text-[#9CA3AF] mb-1 uppercase font-medium">Type</label>
                        <select
                            name="jobType"
                            value={form.jobType}
                            onChange={handleChange}
                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-2 text-sm outline-none text-white appearance-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all cursor-pointer"
                        >
                            <option value="full-time" className="bg-[#141414]">Full-Time</option>
                            <option value="part-time" className="bg-[#141414]">Part-Time</option>
                            <option value="internship" className="bg-[#141414]">Internship</option>
                            <option value="remote" className="bg-[#141414]">Remote</option>
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs text-[#9CA3AF] mb-1 uppercase font-medium">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-2 text-sm outline-none text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all cursor-pointer"
                        >
                            <option value="pending" className="bg-[#141414]">⏳ Pending</option>
                            <option value="interview" className="bg-[#141414]">🗣️ Interview</option>
                            <option value="declined" className="bg-[#141414]">❌ Declined</option>
                            <option value="offered" className="bg-[#141414]">🎉 Offered</option>
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1 uppercase font-medium">Location</label>
                    <input
                        type="text"
                        name="jobLocation"
                        value={form.jobLocation}
                        onChange={handleChange}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-white outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-bold py-3 px-4 rounded-xl mt-4 transition-all ${loading
                        ? "bg-[#1E1E1E] text-[#6B7280] cursor-not-allowed"
                        : "bg-[#10B981] hover:bg-[#059669] text-white shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30"
                        }`}
                >
                    {loading ? "Saving..." : "Add to Dashboard"}
                </button>
            </form>
        </div>
    )
}

export default Form
