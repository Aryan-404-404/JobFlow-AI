import { User, Mail, LogOut, CloudCog } from 'lucide-react';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJob } from '../context/JobContext';

const Profile = () => {

    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const {jobs} = useJob()

    if (!user) return null;

    const handleLogout = async () => {
        try {
            const res = await api.post('/user/logout');
            setUser(null)
            navigate('/login')
            console.log(res.data.message)
        } catch (err) {
            console.error(err.response?.data?.message)
        }
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
            {/* User Info Section - Enhanced Header */}
            <div className="p-6 bg-linear-to-br from-[#10B981]/10 to-transparent border-b border-[#1E1E1E]">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-14 h-14 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shrink-0 ring-2 ring-[#10B981]/20">
                            <span className="text-white font-semibold text-xl">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] rounded-full border-2 border-[#141414]"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate">{user.name}</h3>
                        <p className="text-[#9CA3AF] text-sm truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-b border-[#1E1E1E]">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-white">{jobs.length}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Applications</p>
                    </div>
                    <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-[#10B981]">{jobs.filter((j)=>j.status==='interview').length}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Interviews</p>
                    </div>
                </div>
            </div>

            {/* User Details */}
            <div className="p-4 space-y-3 border-b border-[#1E1E1E]">
                <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-[#1E1E1E] rounded-lg flex items-center justify-center shrink-0">
                        <User size={16} className="text-[#9CA3AF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#6B7280] mb-0.5">Full Name</p>
                        <p className="text-sm text-[#E5E7EB] truncate">{user.name}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-[#1E1E1E] rounded-lg flex items-center justify-center shrink-0">
                        <Mail size={16} className="text-[#9CA3AF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#6B7280] mb-0.5">Email Address</p>
                        <p className="text-sm text-[#E5E7EB] truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-2">
                <button
                    className="w-full flex items-center justify-start space-x-3 px-4 py-2.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-[#E5E7EB] rounded-lg font-medium transition-all text-sm"
                >
                    <User size={16} />
                    <span>View Profile</span>
                </button>

                <button
                    className="w-full flex items-center justify-start space-x-3 px-4 py-2.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-[#E5E7EB] rounded-lg font-medium transition-all text-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-[#1E1E1E]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center cursor-pointer space-x-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 text-[#EF4444] py-2.5 rounded-lg font-medium transition-all"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Profile
