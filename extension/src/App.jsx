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
            resolve(response.data); // 🎉 Success! Returns { headerText, descriptionText, url }
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

  // UI section --------->

  const renderAiResult = () => {
    if (!aiResult) return null;
    const status = getMatchStatus(aiResult.score);

    return (
      <div className="animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex items-center">
          <button onClick={() => setView('menu')} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition">
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
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-xs uppercase font-bold mb-3 flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" /> Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {aiResult.missingKeywords.map((kw, i) => (
              <span key={i} className="bg-red-900/30 text-red-300 border border-red-800/50 px-3 py-1 rounded-lg text-sm font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <button onClick={() => setView('manual')} className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm font-bold text-gray-300 transition">
          Save this Job Anyway
        </button>
      </div>
    );
  };

  // --- RENDER HELPERS ---

  const renderMenu = () => (
    <div className="flex flex-col h-full space-y-4 pt-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-blue-500 flex items-center justify-center gap-2">
          <Briefcase size={28} /> JobFlow AI
        </h1>
      </div>

      <button onClick={handleAiCheck} disabled={loading} className="bg-purple-900/50 hover:bg-purple-900 border border-purple-700 text-purple-100 p-4 rounded-xl flex items-center gap-4 transition-all group w-full">
        <div className="bg-purple-800 p-3 rounded-full group-hover:scale-110 transition">
          {loading ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" /> : <BrainCircuit size={24} />}
        </div>
        <div className="text-left">
          <h3 className="font-bold">AI Fit Check</h3>
          <p className="text-xs text-purple-300">{loading ? "Analyzing..." : "Score match with resume"}</p>
        </div>
      </button>

      <button onClick={handleQuickSave} className="bg-indigo-900/50 hover:bg-indigo-900 border border-indigo-700 text-indigo-100 p-4 rounded-xl flex items-center gap-4 transition-all group">
        <div className="bg-indigo-800 p-3 rounded-full group-hover:scale-110 transition"><Zap size={24} /></div>
        <div className="text-left"><h3 className="font-bold">1-Click Save</h3><p className="text-xs text-indigo-300">Auto-extract details</p></div>
      </button>

      <button onClick={() => setView('manual')} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-100 p-4 rounded-xl flex items-center gap-4 transition-all group">
        <div className="bg-gray-700 p-3 rounded-full group-hover:scale-110 transition"><ClipboardList size={24} /></div>
        <div className="text-left"><h3 className="font-bold">Manual Entry</h3><p className="text-xs text-gray-400">Fill form yourself</p></div>
      </button>
    </div>
  );

  const renderForm = () => (
    <div className="animate-fade-in">
      <div className="flex items-center mb-4">
        <button onClick={() => { setView('menu'); setMessage(null); }} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold ml-2 text-white">Add Manually</h2>
      </div>

      {/* 4. FIXED: Rendering Logic for Object Message */}
      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? "bg-green-900/50 text-green-200 border border-green-800" : "bg-red-900/50 text-red-200 border border-red-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase">Job Link</label>
          <input type="text" name="link" value={form.link} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-blue-300 outline-none" placeholder="https://..." />
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1 uppercase">Company</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none" required />
          </div>
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1 uppercase">Position</label>
            <input type="text" name="position" value={form.position} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none" required />
          </div>
        </div>

        {/* NEW: Type Field Visible in Form */}
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1 uppercase">Type</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none text-white appearance-none"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1 uppercase">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none">
              <option value="pending">⏳ Pending</option>
              <option value="interview">🗣️ Interview</option>
              <option value="declined">❌ Declined</option>
              <option value="offered">🎉 Offered</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase">Location</label>
          <input type="text" name="jobLocation" value={form.jobLocation} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none" />
        </div>

        <button type="submit" disabled={loading} className={`w-full font-bold py-3 px-4 rounded-xl mt-4 transition ${loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
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