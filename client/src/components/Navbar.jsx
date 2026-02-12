import { useState, useEffect } from 'react';
import { Menu, X, Bell, Settings, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {

    const { user } = useAuth() //useContext
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profile, setProfile] = useState(false)
    const [download, setDownload] = useState(false)

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'All Jobs', href: '/jobs' }
    ];

    return (
        <nav className="bg-[#0A0A0A] border-b border-[#1E1E1E] sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">JF</span>
                            </div>
                            <span className="text-xl font-semibold text-white">JobFlow AI</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className='text-[#9CA3AF] hover:text-white hover:bg-[#1E1E1E] px-4 py-2 rounded-lg text-sm font-medium transition-all'
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Side Actions */}
                    {user ? (
                        <div className="hidden md:flex items-center space-x-3">
                            <button className="text-[#9CA3AF] hover:text-white hover:bg-[#1E1E1E] p-2 rounded-lg transition-all">
                                <Settings size={20} />
                            </button>

                            <div className="pl-2 border-l border-[#1E1E1E]">
                                <button 
                                    onClick={() => setProfile(!profile)}
                                    className="flex items-center space-x-2 hover:bg-[#1E1E1E] px-3 py-2 rounded-lg transition-all cursor-pointer"
                                >
                                    <div className="w-8 h-8 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center relative">
                                        <span className="text-white text-sm font-medium">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    </div>
                                </button>
                                {profile && <Profile />}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/#features"
                                className="text-[#9CA3AF] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            >
                                Features
                            </Link>

                            <Link
                                to="/#how-it-works"
                                className="text-[#9CA3AF] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            >
                                How It Works
                            </Link>

                            <Link
                                to="/login"
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[#9CA3AF] hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0A0A0A] border-t border-[#1E1E1E]">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-[#9CA3AF] hover:text-white hover:bg-[#1E1E1E] block px-4 py-3 rounded-lg text-base font-medium transition-all"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="px-4 py-3 border-t border-[#1E1E1E] space-y-3 flex">
                        <button className="text-[#9CA3AF] hover:text-white hover:bg-[#1E1E1E] p-3 rounded-lg transition-all flex items-center">
                            <div className="flex items-center justify-center pt-2">
                                <Settings size={20} />
                            </div>
                        </button>
                        <button
                            onClick={() => setProfile(!profile)}
                            className="flex items-center space-x-3 hover:bg-[#1E1E1E] w-full px-4 py-3 rounded-lg transition-all cursor-pointer"
                        >
                            <div className="w-10 h-10 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                            </div>
                            <span className="text-[#E5E7EB]">{user?.name}</span>
                        </button>
                        {profile && <Profile />}
                    </div>
                </div>
            )}
        </nav>
    );
}