import { Briefcase, Zap, BrainCircuit, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function GetStarted() {
  return (
    <div className="flex flex-col h-full bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
            <Briefcase size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">JobFlow AI</h1>
        </div>
        <p className="text-sm text-gray-400">Your Job Application Companion</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-lg shadow-[#10B981]/20">
            <Sparkles size={40} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">✨</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">Welcome to JobFlow AI</h2>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Sign in to unlock powerful features and start tracking your job applications
          </p>
        </div>

        {/* Features Preview */}
        <div className="w-full space-y-3">
          {/* Feature 1 */}
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-3 flex items-center gap-3">
            <div className="bg-purple-800 p-2 rounded-lg shrink-0">
              <BrainCircuit size={20} className="text-purple-200" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">AI Fit Check</h3>
              <p className="text-xs text-purple-300">Match score with your resume</p>
            </div>
            <CheckCircle size={16} className="text-purple-400" />
          </div>

          {/* Feature 2 */}
          <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-3 flex items-center gap-3">
            <div className="bg-indigo-800 p-2 rounded-lg shrink-0">
              <Zap size={20} className="text-indigo-200" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">1-Click Save</h3>
              <p className="text-xs text-indigo-300">Auto-extract job details</p>
            </div>
            <CheckCircle size={16} className="text-indigo-400" />
          </div>

          {/* Feature 3 */}
          <div className="bg-[#10B981]/20 border border-[#10B981]/50 rounded-lg p-3 flex items-center gap-3">
            <div className="bg-[#10B981] p-2 rounded-lg shrink-0">
              <Briefcase size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Track Everything</h3>
              <p className="text-xs text-green-300">Organize all applications</p>
            </div>
            <CheckCircle size={16} className="text-green-400" />
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-gray-500 text-center max-w-xs">
          New to JobFlow AI?{' '}
          <button
            onClick={() => window.open(import.meta.env.VITE_FRONTEND_URL, '_blank')}
            className="text-[#10B981] hover:text-[#059669] font-medium transition-all"
          >
            Create an account
          </button>
        </p>
      </div>

      {/* Bottom Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-600">
          Free • Secure • Easy to Use
        </p>
      </div>
    </div>
  );
}