import { Download, TrendingUp, Bell, FileText, Chrome } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function GetStarted() {

  const location = useLocation()
  useEffect(() => {
    if(location.hash){
      const element = document.getElementById(location.hash.substring(1))
      if(element){
        element.scrollIntoView({behavior: 'smooth'})
      }
    }
  }, [location])
  

  const features = [
    {
      icon: <FileText size={24} />,
      title: "Track All Applications",
      description: "Keep all your job applications organized in one place across multiple platforms"
    },
    {
      icon: <Bell size={24} />,
      title: "Status Updates",
      description: "Monitor application status - In Touch, Interview, Rejected, or Offer Received"
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Analytics Dashboard",
      description: "Get insights on your job search with detailed analytics and progress tracking"
    },
    {
      icon: <Chrome size={24} />,
      title: "Browser Extension",
      description: "One-click save applications from LinkedIn, Indeed, and other job sites"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
            Take Control of Your Job Search
          </h1>
          <p className="text-xl text-[#9CA3AF] mb-8 max-w-3xl mx-auto">
            Track, organize, and manage all your job applications in one place. Never lose track of an opportunity again with JobFlow AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30">
              <span>Get Started Free</span>
            </button>
            <button className="border border-[#2A2A2A] hover:border-[#10B981] hover:bg-[#1E1E1E] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all flex items-center space-x-2">
              <Download size={20} />
              <span>Download Extension</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#10B981]/50 transition-all">
            <div className="text-4xl font-bold text-[#10B981] mb-2">10,000+</div>
            <div className="text-[#9CA3AF]">Active Users</div>
          </div>
          <div className="text-center bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#10B981]/50 transition-all">
            <div className="text-4xl font-bold text-[#10B981] mb-2">50,000+</div>
            <div className="text-[#9CA3AF]">Applications Tracked</div>
          </div>
          <div className="text-center bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#10B981]/50 transition-all">
            <div className="text-4xl font-bold text-[#10B981] mb-2">85%</div>
            <div className="text-[#9CA3AF]">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="border-t border-[#1E1E1E] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-[#9CA3AF] text-center mb-16 max-w-2xl mx-auto">
            Powerful features to streamline your job search and keep you organized
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#10B981]/50 hover:bg-[#1A1A1A] transition-all">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center text-[#10B981] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-[#9CA3AF]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#10B981]/20">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Sign Up & Install</h3>
              <p className="text-[#9CA3AF]">Create your account and install our browser extension in seconds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#10B981]/20">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Apply & Track</h3>
              <p className="text-[#9CA3AF]">Apply to jobs and automatically save them to your dashboard</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#10B981]/20">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Manage & Succeed</h3>
              <p className="text-[#9CA3AF]">Update status, get insights, and land your dream job</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-[#10B981] to-[#059669] py-16 border-t border-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Job Search?</h2>
          <p className="text-xl text-white/80 mb-8">Join thousands of job seekers who are already organized and ahead</p>
          <button className="bg-white text-[#059669] hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-xl">
            Get Started Now - It's Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#1E1E1E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">JF</span>
                </div>
                <span className="text-xl font-semibold">JobFlow AI</span>
              </div>
              <p className="text-[#9CA3AF] text-sm">Track your job applications smarter, not harder.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-[#9CA3AF] text-sm">
                <li><a href="#" className="hover:text-[#10B981] transition-all">Features</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-all">Pricing</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-all">Extension</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-[#9CA3AF] text-sm">
                <li><a href="#" className="hover:text-[#10B981] transition-all">About</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-all">Blog</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-all">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-[#9CA3AF] text-sm">
                <li><a href="#" className="hover:text-[#10B981] transition-all">Privacy</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-all">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1E1E1E] mt-8 pt-8 text-center text-[#6B7280] text-sm">
            © 2026 JobFlow AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}