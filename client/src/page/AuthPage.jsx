import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react';
import { Link } from 'lucide-react';
import api from '../config/axios';
import Toast from '../components/Toast';

const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post('/user/login', formData);
        setToast({ message: "Login Successfull!", type: "success" })
        console.log('Login Success:', res.data);
        setUser(true)
        window.location.href = '/';
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        const res = await api.post('/user/register', formData);
        console.log('Register Success:', res.data);
        setToast({ message: "Login Successfull!", type: "success" })
        setUser(true)
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Error:', err.response?.data?.message || err.message);
      setToast({ message: err.response?.data?.message, type: "error" })
    }
    finally {
      setTimeout(() => {
        setToast(null);
      }, 2000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-[#10B981]/5 via-transparent to-transparent"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">JF</span>
            </div>
            <span className="text-2xl font-semibold">JobFlow AI</span>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            {isLogin ? 'Welcome back! Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-8 shadow-2xl">
          {/* Toggle Tabs */}
          <div className="flex mb-8 bg-[#0A0A0A] rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin
                  ? 'bg-[#10B981] text-white'
                  : 'text-[#9CA3AF] hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin
                  ? 'bg-[#10B981] text-white'
                  : 'text-[#9CA3AF] hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-12 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-white transition-all"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login Only) */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded focus:ring-2 focus:ring-[#10B981] accent-[#10B981]"
                  />
                  <span className="ml-2 text-[#9CA3AF] group-hover:text-white transition-all">Remember me</span>
                </label>
                <button className="text-[#10B981] hover:text-[#059669] transition-all">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms & Conditions (Register Only) */}
            {!isLogin && (
              <div className="flex items-start text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded focus:ring-2 focus:ring-[#10B981] accent-[#10B981]"
                />
                <span className="ml-2 text-[#9CA3AF]">
                  I agree to the{' '}
                  <button className="text-[#10B981] hover:text-[#059669] transition-all">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-[#10B981] hover:text-[#059669] transition-all">
                    Privacy Policy
                  </button>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#141414] text-[#6B7280]">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button 
            type="button"
            onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self")}
            className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
          </div>

          {/* Extension CTA */}
          {!isLogin && (
            <div className="mt-6 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Chrome className="text-[#10B981] shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-[#E5E7EB] mb-2">
                    Don't forget to install our browser extension for seamless tracking!
                  </p>
                  <button className="text-[#10B981] hover:text-[#059669] text-sm font-medium transition-all">
                    Download Extension →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-[#9CA3AF] hover:text-white text-sm transition-all inline-flex items-center gap-1">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
