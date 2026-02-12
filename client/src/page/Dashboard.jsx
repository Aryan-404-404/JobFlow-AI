import { Plus, Briefcase, Calendar, Clock, Download, Building2, FileText} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import JobForm from '../components/JobForm';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom'
import { useJob } from '../context/JobContext';
import ResumeSection from '../components/ResumeSection';
import { handleDownload } from '../utils/handleDownload';

export default function Dashboard() {
  const { user } = useAuth()
  const { jobs, loading } = useJob()

  const navigate = useNavigate()
  const [addJob, setAddJob] = useState(false)
  const [toast, setToast] = useState(null)
  const [currentJob, setCurrentJob] = useState(null);
  const [showResume, setShowResume] = useState(false)

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Header */}
      <div className="border-b border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}</h1>
              <p className="text-[#9CA3AF] mt-1">Track your job applications and stay organized</p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowResume(!showResume)}
                className="flex items-center justify-center space-x-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white px-5 py-2.5 rounded-lg font-medium transition-all border border-[#2A2A2A]"
              >
                <FileText size={18} />
                <span>Update Resume</span>
              </button>
              <button 
                onClick={() => setAddJob(!addJob)} 
                className="flex items-center justify-center space-x-2 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-lg font-medium transition-all"
              >
                <Plus size={18} />
                <span>Add Job</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {addJob && <JobForm addJob={addJob} setAddJob={setAddJob} setToast={setToast} currentJob={currentJob} setCurrentJob={setCurrentJob} />}
      {showResume && <ResumeSection/>}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-[#141414] rounded-xl p-6 transition-all hover:bg-[#1A1A1A]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                <Briefcase className="text-[#10B981]" size={20} />
              </div>
            </div>
            <h3 className="text-[#9CA3AF] text-sm font-medium mb-1">Total Applications</h3>
            <p className="text-4xl font-bold text-white">{jobs.length}</p>
          </div>

          {/* Interviews Scheduled */}
          <div className="bg-[#141414] rounded-xl p-6 transition-all hover:bg-[#1A1A1A]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-[#10B981]" size={20} />
              </div>
            </div>
            <h3 className="text-[#9CA3AF] text-sm font-medium mb-1">Interviews Scheduled</h3>
            <p className="text-4xl font-bold text-white">{jobs.filter(j => j.status === 'interview').length}</p>
          </div>

          {/* Pending Responses */}
          <div className="bg-[#141414] rounded-xl p-6 transition-all hover:bg-[#1A1A1A]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                <Clock className="text-[#10B981]" size={20} />
              </div>
            </div>
            <h3 className="text-[#9CA3AF] text-sm font-medium mb-1">Pending Responses</h3>
            <p className="text-4xl font-bold text-white">{jobs.filter(j => j.status === 'pending').length}</p>
          </div>
        </div>

        {/* Main Content Grid - 75% / 25% Split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Side - Recent Activity (75% width = 3 columns) */}
          <div className="lg:col-span-3 bg-[#141414] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button 
                onClick={() => navigate('/jobs')} 
                className="text-[#10B981] hover:text-[#059669] text-sm font-medium transition cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E1E1E]">
                    <th className="text-left text-[#9CA3AF] text-sm font-medium pb-3">Company</th>
                    <th className="text-left text-[#9CA3AF] text-sm font-medium pb-3">Position</th>
                    <th className="text-left text-[#9CA3AF] text-sm font-medium pb-3">Date Applied</th>
                    <th className="text-left text-[#9CA3AF] text-sm font-medium pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 6).map(job => (
                    <tr key={job._id} className="border-b border-[#1E1E1E] hover:bg-[#1A1A1A] transition">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#1E1E1E] rounded-lg flex items-center justify-center shrink-0">
                            <Building2 size={18} className="text-[#9CA3AF]" />
                          </div>
                          {job.link ? (
                            <a href={job.link} target="_blank" className="text-white font-medium hover:text-[#10B981] transition">
                              {job.company}
                            </a>
                          ) : (
                            <span className="text-white font-medium">{job.company}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-[#E5E7EB]">{job.position}</td>
                      <td className="py-4 text-[#9CA3AF]">
                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'interview' ? 'bg-[#10B981]/10 text-[#10B981]' :
                          job.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          job.status === 'rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                          'bg-[#10B981]/10 text-[#10B981]'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - Extension Promo & Quick Actions (25% width = 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-linear-to-br from-[#10B981] to-[#059669] rounded-xl p-6">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Download size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Get the Extension</h3>
              <p className="text-white/80 text-sm mb-6">
                Install our Chrome extension to automatically track job applications from LinkedIn, Indeed, and more.
              </p>
              <button 
              onClick={handleDownload}
              className="w-full bg-white hover:bg-gray-100 text-[#059669] py-2.5 rounded-lg font-medium transition flex items-center justify-center space-x-2">
                <Download size={16} />
                <span>Get it now</span>
              </button>
              <p className="text-white/60 text-xs mt-4 text-center">
                Free • Works on Chrome & Edge
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[#141414] rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg text-sm text-[#E5E7EB] transition">
                  📊 View Analytics
                </button>
                <button className="w-full text-left px-4 py-2.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg text-sm text-[#E5E7EB] transition">
                  📝 Update Status
                </button>
                <button className="w-full text-left px-4 py-2.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg text-sm text-[#E5E7EB] transition">
                  🔔 Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}