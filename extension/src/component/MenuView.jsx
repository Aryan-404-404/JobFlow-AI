import api from '../config/axios';

import {
  ClipboardList,
  Zap,
  BrainCircuit,
  Briefcase,
  Mail,
} from 'lucide-react';

const MenuView = ({ setForm, setMessage, loading, setLoading, setDescription, view, setView, setAiResult, setEmailData, setAuthState}) => {

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

    const handleDraftEmail = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const rawData = await scrapeJobData();
            setMessage({ text: "✍️ AI is drafting your email...", type: "success" });

            const emailRes = await api.post('/ai/generateEmail', {
                title: rawData.headerText,
                description: rawData.descriptionText
            });

            if (emailRes.data.success) {
                setEmailData({
                    subject: emailRes.data.subject,
                    body: emailRes.data.body
                });
                setMessage({ text: "✨ Email drafted successfully!", type: "success" });
                setView('email-result');
            } else {
                setMessage({ text: `❌ ${emailRes.data.body}`, type: "error" });
            }
        } catch (error) {
            console.error(error);
            setMessage({ text: "❌ Failed to generate email. Make sure resume is uploaded.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear extension cookies
        if (typeof chrome !== "undefined" && chrome.cookies) {
            chrome.cookies.getAll({
                url: import.meta.env.VITE_API_URL,
            }, (cookies) => {
                cookies.forEach(cookie => {
                    chrome.cookies.remove({
                        url: import.meta.env.VITE_API_URL,
                        name: cookie.name
                    });
                });
                console.log("Cookies cleared");
            });
        }

        // Reset auth state
        setAuthState({ isLoading: false, isAuthenticated: false, user: null });
    };

    return (
        <div className="flex flex-col h-full space-y-4 pt-4">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center shadow-lg shadow-[#10B981]/30">
                        <Briefcase size={20} className="text-white" />
                    </div>
                    JobFlow AI
                </h1>
            </div>

            {/* AI Fit Check */}
            <button
                onClick={handleAiCheck}
                disabled={loading}
                className="bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-white p-4 rounded-xl flex items-center gap-4 transition-all group w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="bg-purple-600/20 p-3 rounded-lg group-hover:scale-110 transition-all">
                    {loading ? (
                        <div className="animate-spin h-6 w-6 border-2 border-purple-400 border-t-transparent rounded-full" />
                    ) : (
                        <BrainCircuit size={24} className="text-purple-400" />
                    )}
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-white">AI Fit Check</h3>
                    <p className="text-xs text-purple-300">{loading ? "Analyzing..." : "Score match with resume"}</p>
                </div>
            </button>

            {/* 1-Click Save */}
            <button
                onClick={handleQuickSave}
                className="bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-white p-4 rounded-xl flex items-center gap-4 transition-all group w-full"
            >
                <div className="bg-[#10B981]/20 p-3 rounded-lg group-hover:scale-110 transition-all">
                    <Zap size={24} className="text-[#10B981]" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-white">1-Click Save</h3>
                    <p className="text-xs text-[#10B981]/80">Auto-extract details</p>
                </div>
            </button>

            {/* Manual Entry */}
            <button
                onClick={() => setView('manual')}
                className="bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white p-4 rounded-xl flex items-center gap-4 transition-all group w-full"
            >
                <div className="bg-[#2A2A2A] p-3 rounded-lg group-hover:scale-110 transition-all">
                    <ClipboardList size={24} className="text-[#9CA3AF]" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-white">Manual Entry</h3>
                    <p className="text-xs text-[#9CA3AF]">Fill form yourself</p>
                </div>
            </button>

            {/* Draft Cold Email */}
            <button
                onClick={handleDraftEmail}
                disabled={loading}
                className="bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-white p-4 rounded-xl flex items-center gap-4 transition-all group w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="bg-cyan-600/20 p-3 rounded-lg group-hover:scale-110 transition-all">
                    {loading && view === 'menu' ? (
                        <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
                    ) : (
                        <Mail size={24} className="text-cyan-400" />
                    )}
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-white">Draft Cold Email</h3>
                    <p className="text-xs text-cyan-300">{loading ? "Drafting..." : "Generate cover letter"}</p>
                </div>
            </button>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="mt-auto bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] p-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
            </button>
        </div>
    )
}

export default MenuView
