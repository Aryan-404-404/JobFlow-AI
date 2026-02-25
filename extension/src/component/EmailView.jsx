import { useState } from 'react';
import {
    ChevronLeft,
    Copy
} from 'lucide-react';

const EmailView = ({ setView, emailData }) => {

    const [isCopied, setIsCopied] = useState(false);

    if (!emailData) return null;

    const handleCopyEmail = () => {
        const fullText = `Subject: ${emailData.subject}\n\n${emailData.body}`;
        navigator.clipboard.writeText(fullText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-4 flex flex-col h-full pb-4">
            {/* Header */}
            <div className="flex items-center">
                <button
                    onClick={() => setView('menu')}
                    className="p-1 hover:bg-[#1E1E1E] rounded text-[#9CA3AF] hover:text-white transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-lg font-bold ml-2 text-white">AI Cold Email</h2>
            </div>

            {/* Email Content */}
            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] flex-1 flex flex-col gap-3">
                <div>
                    <label className="text-xs text-[#9CA3AF] font-bold uppercase mb-1 block">Subject</label>
                    <div className="bg-[#0A0A0A] p-2 rounded-lg text-sm text-white border border-[#2A2A2A]">
                        {emailData.subject}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <label className="text-xs text-[#9CA3AF] font-bold uppercase mb-1 block">Message</label>
                    <textarea
                        readOnly
                        className="w-full flex-1 bg-[#0A0A0A] p-3 rounded-lg text-sm text-gray-300 border border-[#2A2A2A] resize-none outline-none custom-scrollbar min-h-50"
                        value={emailData.body}
                    />
                </div>
            </div>

            {/* Copy Button */}
            <button
                onClick={handleCopyEmail}
                className={`w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${isCopied
                    ? "bg-[#10B981] text-white"
                    : "bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white border border-[#2A2A2A]"
                    }`}
            >
                {isCopied ? "✅ Copied to Clipboard!" : <><Copy size={18} /> Copy Email</>}
            </button>
        </div>
    );
}

export default EmailView
