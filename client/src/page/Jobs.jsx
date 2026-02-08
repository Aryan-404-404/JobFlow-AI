import { useState } from 'react';
import { Search, ChevronUp, Building2, Pencil, Trash2, Plus, ChevronDown } from 'lucide-react';
import { useJob } from '../context/JobContext';
import JobForm from '../components/JobForm';
import Toast from '../components/Toast';

const Jobs = () => {

  const { jobs, deleteJob } = useJob();

  const [currentJob, setCurrentJob] = useState(null)
  const [addJob, setAddJob] = useState(false)
  const [toast, setToast] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: ""
  })
  const [expandedJobId, setExpandedJobId] = useState(null);

  const handleEdit = async (job) => {
    setCurrentJob(job);
    setAddJob(true);
  }

  const handleDelete = async (id) => {
    const res = await deleteJob(id);
    if (res.success) {
      setToast({ message: "Job Successfully Deleted!", type: "success" })
    }
    else {
      setToast({ message: res.err, type: "error" })
    }
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const displayedJobs = jobs.filter((job) => {
    const matchStatus = filters.status === "" || filters.status === job.status
    const matchType = filters.type === "" || filters.type === job.jobType
    const searchLower = filters.search.toLowerCase()
    const matchSearch = searchLower === "" || job.company.toLowerCase().includes(searchLower)
    return matchStatus && matchType && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white ">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {addJob &&
        <JobForm
          addJob={addJob}
          setAddJob={setAddJob}
          setToast={setToast}
          setCurrentJob={setCurrentJob}
          currentJob={currentJob} />
      }
      {/* Header */}
      <div className="border-b border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">All Job Applications</h1>
              <p className="text-[#9CA3AF] mt-1">Manage and track all your job applications</p>
            </div>
            <button
              onClick={() => setAddJob(!addJob)}
              className="flex items-center justify-center space-x-2 bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              <span>Add Job</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters & Search Section */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                <input
                  name='search'
                  value={filters.search}
                  onChange={handleFilterChange}
                  type="text"
                  placeholder="Search by company or position..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div className="w-full lg:w-48">
              <select
                name='status'
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#141414]">All Status</option>
                <option value="pending" className="bg-[#141414]">Pending</option>
                <option value="interview" className="bg-[#141414]">Interview</option>
                <option value="rejected" className="bg-[#141414]">Rejected</option>
                <option value="offer" className="bg-[#141414]">Offer</option>
              </select>
            </div>

            {/* Filter by Job Type */}
            <div className="w-full lg:w-48">
              <select
                name='type'
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#141414]">All Job Types</option>
                <option value="full-time" className="bg-[#141414]">Full-Time</option>
                <option value="part-time" className="bg-[#141414]">Part-Time</option>
                <option value="remote" className="bg-[#141414]">Remote</option>
                <option value="internship" className="bg-[#141414]">Internship</option>
              </select>
            </div>

            {/* Filter by Location */}
            <div className="w-full lg:w-48">
              <input
                type="text"
                placeholder="Location..."
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[#9CA3AF]">
              Showing <span className="text-white font-medium">{jobs.length}</span> applications
            </p>
            <button className="text-sm text-[#10B981] hover:text-[#059669] transition-all">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Company</th>
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Position</th>
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Date Applied</th>
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Status</th>
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Job Type</th>
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Location</th>
                  <th className="text-left text-[#9CA3AF] text-sm font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedJobs.map(job => (
                  <>
                    <tr key={job._id} className="border-b border-[#1E1E1E] hover:bg-[#1A1A1A] transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#1E1E1E] rounded-lg flex items-center justify-center shrink-0">
                            <Building2 size={18} className="text-[#9CA3AF]" />
                          </div>
                          {job.link ? (
                            <a href={job.link} target="_blank" className="text-white font-medium hover:text-[#10B981] transition-all">
                              {job.company}
                            </a>
                          ) : (
                            <span className="text-white font-medium">{job.company}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#E5E7EB]">{job.position}</td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'interview' ? 'bg-[#10B981]/10 text-[#10B981]' :
                          job.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            job.status === 'rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                              'bg-[#10B981]/10 text-[#10B981]'
                          }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        {job.jobType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{job.jobLocation}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-[#9CA3AF] hover:text-[#10B981] transition-all cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="text-[#9CA3AF] hover:text-[#EF4444] transition-all cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => setExpandedJobId(expandedJobId === job._id ? null : job._id)}
                            className="text-[#9CA3AF] hover:text-[#10B981] transition-all cursor-pointer"
                            title={expandedJobId === job._id ? "Hide details" : "Show details"}
                          >
                            {expandedJobId === job._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedJobId === job._id && (
                      <tr className="border-b border-[#1E1E1E] bg-[#0A0A0A]">
                        <td colSpan={7} className="px-6 py-6">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-[#E5E7EB]">Job Description</h4>
                            {job.description ? (
                              <p className="text-sm text-[#9CA3AF] leading-relaxed whitespace-pre-wrap">
                                {job.description}
                              </p>
                            ) : (
                              <p className="text-sm text-[#6B7280] italic">
                                No description available for this job.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State (if no jobs) */}
          {displayedJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-[#6B7280]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">No jobs found</h3>
              <p className="text-[#9CA3AF] mb-6">Try adjusting your filters or add a new job application</p>
              <button
                onClick={() => setAddJob(!addJob)}
                className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Add Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Jobs