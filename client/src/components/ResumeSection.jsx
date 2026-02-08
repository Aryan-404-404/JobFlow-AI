import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Save, Loader, AlertCircle, CheckCircle2, Upload, Type, X } from 'lucide-react';
import api from '../config/axios';

function ResumeSection() {
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [inputMethod, setInputMethod] = useState('upload'); // 'text' or 'upload'
    const [fileName, setFileName] = useState('');

    // Fetch resume on component mount
    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        setFetching(true);
        setError('');
        try {
            const res = await api.get('/user/resume')
            if (res.data?.resume) {
                setResume(res.data.resume);
            }
        } catch (err) {
            console.error('Error fetching resume:', err);
            setError(err.response?.data?.message || 'Failed to load resume');
        } finally {
            setFetching(false);
        }
    };

    const handleSaveResume = async () => {
        if (!resume.trim()) {
            setError('Resume cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await api.put('/user/resume', { resumeText: resume });

            if (res.status === 200) {
                setSuccessMessage('Resume saved successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error saving resume:', err);
            setError(err.response?.data?.message || 'Failed to save resume');
        } finally {
            setLoading(false);
        }
    };

    const handleTextareaChange = (e) => {
        setResume(e.target.value);
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a .txt, .pdf, or .docx file');
            return;
        }

        setFileName(file.name);
        setError('');
        setSuccessMessage('');

        // Read file content (for .txt files)
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                setResume(event.target.result);
            };
            reader.onerror = () => {
                setError('Failed to read file');
            };
            reader.readAsText(file);
        } else {
            // For PDF/DOCX, you'd need a parser library
            setError('PDF/DOCX parsing coming soon. Please use .txt files or paste text directly.');
        }
    };

    return (
        <div className="bg-[#141414] border border-[#2A2A2A] shadow-2xl max-w-7xl mx-auto sm:px-6 lg:px-8 py-6 rounded-2xl">
            {/* Header */}
            <div className="p-6 border-b border-[#1E1E1E]">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#10B981]/10 rounded-lg">
                        <FileText className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-1">Your Resume</h2>
                        <p className="text-sm text-[#9CA3AF]">
                            Upload or paste your resume. This will be used by our AI to match and score job opportunities.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#EF4444]">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#10B981]">{successMessage}</p>
                    </div>
                )}

                {/* Loading State - Fetching */}
                {fetching ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 text-[#10B981] animate-spin" />
                        <span className="ml-3 text-[#9CA3AF]">Loading resume...</span>
                    </div>
                ) : (
                    <>
                        {/* Input Method Toggle */}
                        <div className="mb-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setInputMethod('text')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${inputMethod === 'text'
                                            ? 'bg-[#10B981] text-white'
                                            : 'bg-[#1E1E1E] text-[#9CA3AF] hover:bg-[#2A2A2A] hover:text-white'
                                        }`}
                                >
                                    <Type size={18} />
                                    <span>Paste Text</span>
                                </button>
                                <button
                                    onClick={() => setInputMethod('upload')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${inputMethod === 'upload'
                                            ? 'bg-[#10B981] text-white'
                                            : 'bg-[#1E1E1E] text-[#9CA3AF] hover:bg-[#2A2A2A] hover:text-white'
                                        }`}
                                >
                                    <Upload size={18} />
                                    <span>Upload File</span>
                                </button>
                            </div>
                        </div>

                        {/* Text Input Method */}
                        {inputMethod === 'text' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Resume Content
                                </label>
                                <textarea
                                    value={resume}
                                    onChange={handleTextareaChange}
                                    rows={20}
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 text-white font-mono text-sm placeholder-[#6B7280] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none transition-all resize-y"
                                    placeholder="Paste your resume here...

                                                Example:
                                                JOHN DOE
                                                Software Engineer | john@example.com | (555) 123-4567

                                                EXPERIENCE
                                                Senior Frontend Developer | Tech Corp | 2020-Present
                                                - Built scalable React applications
                                                - Improved performance by 40%

                                                EDUCATION
                                                BS Computer Science | University | 2016-2020

                                                SKILLS
                                                JavaScript, React, Node.js, Python, SQL"
                                />
                                <p className="mt-2 text-xs text-[#6B7280]">
                                    Tip: Include your contact info, experience, education, and skills for best AI matching results.
                                </p>
                            </div>
                        )}

                        {/* File Upload Method */}
                        {inputMethod === 'upload' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                    Upload Resume File
                                </label>

                                {/* File Upload Area */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".txt,.pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label
                                        htmlFor="resume-upload"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#2A2A2A] rounded-lg cursor-pointer bg-[#0A0A0A] hover:bg-[#1A1A1A] hover:border-[#10B981]/50 transition-all"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-12 h-12 text-[#9CA3AF] mb-3" />
                                            <p className="mb-2 text-sm text-[#E5E7EB]">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-[#6B7280]">
                                                TXT, PDF, DOC, or DOCX (MAX. 10MB)
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* File Name Display */}
                                {fileName && (
                                    <div className="mt-4 p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#10B981]" />
                                            <span className="text-sm text-[#E5E7EB]">{fileName}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFileName('');
                                                setResume('');
                                            }}
                                            className="text-[#9CA3AF] hover:text-white transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Preview text content if uploaded */}
                                {resume && inputMethod === 'upload' && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                            Preview
                                        </label>
                                        <textarea
                                            value={resume}
                                            onChange={handleTextareaChange}
                                            rows={12}
                                            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 text-white font-mono text-sm placeholder-[#6B7280] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none transition-all resize-y"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSaveResume}
                            disabled={loading || !resume.trim()}
                            className="w-full bg-[#10B981] hover:bg-[#059669] disabled:bg-[#1E1E1E] disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Resume</span>
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResumeSection;