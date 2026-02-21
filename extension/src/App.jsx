/* global chrome */
import { useState, useEffect } from 'react';
import api from "./config/axios.js"
import GetStarted from './component/GetStarted.jsx';
import {
  ClipboardList,
  Zap,
  BrainCircuit,
  ChevronLeft,
  Briefcase
} from 'lucide-react';

function App() {
  const [view, setView] = useState('menu');

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("")
  const [aiResult, setAiResult] = useState(null);
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  })

  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "pending",
    jobType: "full-time",
    link: "",
    jobLocation: "Unknown"
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/user/info");
        if (response.status === 200) {
          const data = await response.data;
          setAuthState({ isLoading: false, isAuthenticated: true, user: data });
        } else {
          setAuthState({ isLoading: false, isAuthenticated: false, user: null });
        }
      } catch (error) {
        console.error("Auth check failed (Server likely down):", error);
        setAuthState({ isLoading: false, isAuthenticated: false, user: null });
      }
    };
    checkAuth();
  }, []);

  // --- Auto-Fill Link on Load ---
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          setForm(prev => ({ ...prev, link: tabs[0].url }));
        }
      });
    }
  }, []);

  if (authState.isLoading) {
    return (
      <div className="w-75 h-100 flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <GetStarted />
  }

  const scrapeJobData = () => {
    return new Promise((resolve, reject) => {
      if (typeof chrome === "undefined" || !chrome.tabs) {
        return reject("⚠️ Use this in the Chrome Extension!");
      }
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) return reject("No active tab found.");

        // 3. Send Message to content.js
        chrome.tabs.sendMessage(tabs[0].id, { action: "SCRAPE_JOB" }, (response) => {
          if (chrome.runtime.lastError) {
            return reject("⚠️ Please REFRESH the LinkedIn page first!");
          }
          if (response && response.success) {
            resolve(response.data);
          } else {
            reject("❌ Could not scrape page details.");
          }
        });
      });
    })
  }

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

  const handleQuickSave = async () => {
    setLoading(true);
    setMessage({ text: "🕵️ Scrapping page...", type: "success" });

    try {
      const rawData = await scrapeJobData();
      setMessage({ text: "🤖 AI is extracting details...", type: "success" });
      const aiRes = await api.post('/ai/extract', {
        headerText: rawData.headerText,
        descriptionText: rawData.descriptionText
      })
      const extracted = aiRes.data;
      setForm(prev => ({
        ...prev,
        company: extracted.company || "",
        position: extracted.position || "",
        jobType: extracted.jobType || "full-time",
        jobLocation: extracted.jobLocation || "Unknown",
        link: rawData.url
      }));
      setDescription(rawData.descriptionText);

      setMessage({ text: "✨ Details Extracted! Review & Save.", type: "success" });
      setView('manual');
    } catch (error) {
      console.error(error);
      setMessage({ text: typeof error === 'string' ? error : "❌ Extraction Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getMatchStatus = (score) => {
    if (score >= 80) return { label: "Excellent 🌟", color: "text-green-400 border-green-500 bg-green-900/20" };
    if (score >= 50) return { label: "Good 👍", color: "text-yellow-400 border-yellow-500 bg-yellow-900/20" };
    return { label: "Poor ⚠️", color: "text-red-400 border-red-500 bg-red-900/20" };
  };

  const handleAiCheck = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const rawData = await scrapeJobData();
      setForm(prev => ({ ...prev, link: rawData.url }));
      setMessage({ text: "🤖Getting AI response...", type: "success" });
      const scoreRes = await api.post('/ai/response', {
        title: rawData.headerText,
        description: rawData.descriptionText
      })
      const extracted = scoreRes.data;
      setAiResult({
        score: extracted.score,
        missingKeywords: extracted.missingKeywords
      })
      setDescription(rawData.descriptionText);
      setMessage({ text: "✨ AI Response Got!", type: "success" });
      setView('ai-result');
    } catch (error) {
      console.error(error);
      setMessage({ text: typeof error === 'string' ? error : "❌ AI response failed Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
  // Clear extension cookies
  if (typeof chrome !== "undefined" && chrome.cookies) {
    chrome.cookies.getAll({ 
      url: "https://jobflow-ai-9xi5.onrender.com" 
    }, (cookies) => {
      cookies.forEach(cookie => {
        chrome.cookies.remove({
          url: "https://jobflow-ai-9xi5.onrender.com",
          name: cookie.name
        });
      });
      console.log("Cookies cleared");
    });
  }
  
  // Reset auth state
  setAuthState({ isLoading: false, isAuthenticated: false, user: null });
};

  // UI section --------->
  const renderAiResult = () => {
    if (!aiResult) return null;
    const status = getMatchStatus(aiResult.score);

    return (
      <div className="animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex items-center">
          <button
            onClick={() => setView('menu')}
            className="p-1 hover:bg-[#1E1E1E] rounded text-[#9CA3AF] hover:text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold ml-2 text-white">AI Analysis</h2>
        </div>

        {/* Score Card */}
        <div className={`p-6 border-2 rounded-2xl text-center ${status.color}`}>
          <h1 className="text-5xl font-black mb-2">{aiResult.score}%</h1>
          <p className="font-bold uppercase tracking-widest text-sm opacity-90">{status.label}</p>
        </div>

        {/* Missing Keywords */}
        <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
          <h3 className="text-[#9CA3AF] text-xs uppercase font-bold mb-3 flex items-center gap-2">
            <Zap size={14} className="text-[#F59E0B]" /> Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {aiResult.missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-3 py-1 rounded-lg text-sm font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setView('manual')}
          className="w-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] py-3 rounded-xl text-sm font-bold text-[#E5E7EB] transition-all"
        >
          Save this Job Anyway
        </button>
      </div>
    );
  };
  
  const renderMenu = () => (
    <div className="flex flex-col h-full space-y-4 pt-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
            <Briefcase size={20} className="text-white" />
          </div>
          JobFlow AI
        </h1>
      </div>

      {/* AI Fit Check */}
      <button
        onClick={handleAiCheck}
        disabled={loading}
        className="bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50 text-purple-100 p-4 rounded-xl flex items-center gap-4 transition-all group w-full"
      >
        <div className="bg-purple-800 p-3 rounded-full group-hover:scale-110 transition">
          {loading ? (
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <BrainCircuit size={24} />
          )}
        </div>
        <div className="text-left">
          <h3 className="font-bold">AI Fit Check</h3>
          <p className="text-xs text-purple-300">{loading ? "Analyzing..." : "Score match with resume"}</p>
        </div>
      </button>

      {/* 1-Click Save */}
      <button
        onClick={handleQuickSave}
        className="bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-100 p-4 rounded-xl flex items-center gap-4 transition-all group"
      >
        <div className="bg-indigo-800 p-3 rounded-full group-hover:scale-110 transition">
          <Zap size={24} />
        </div>
        <div className="text-left">
          <h3 className="font-bold">1-Click Save</h3>
          <p className="text-xs text-indigo-300">Auto-extract details</p>
        </div>
      </button>

      {/* Manual Entry */}
      <button
        onClick={() => setView('manual')}
        className="bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-gray-100 p-4 rounded-xl flex items-center gap-4 transition-all group"
      >
        <div className="bg-[#2A2A2A] p-3 rounded-full group-hover:scale-110 transition">
          <ClipboardList size={24} />
        </div>
        <div className="text-left">
          <h3 className="font-bold">Manual Entry</h3>
          <p className="text-xs text-[#9CA3AF]">Fill form yourself</p>
        </div>
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 text-red-100 p-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </div>
  );

  
  const renderForm = () => (
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
  );

  return (
    <div className="p-5 bg-gray-950 h-150 w-87.5 text-white font-sans overflow-y-auto custom-scrollbar">
      {view === 'menu' && renderMenu()}
      {view === 'manual' && renderForm()}
      {view === 'ai-result' && renderAiResult()}
    </div>
  );
}

export default App;