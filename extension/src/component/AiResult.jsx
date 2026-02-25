import {
    Zap,
    ChevronLeft
} from 'lucide-react';

const getMatchStatus = (score) => {
    if (score >= 80) return { label: "Excellent 🌟", color: "text-green-400 border-green-500 bg-green-900/20" };
    if (score >= 50) return { label: "Good 👍", color: "text-yellow-400 border-yellow-500 bg-yellow-900/20" };
    return { label: "Poor ⚠️", color: "text-red-400 border-red-500 bg-red-900/20" };
};

const AiResult = ({ setView, aiResult }) => {
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
}

export default AiResult
