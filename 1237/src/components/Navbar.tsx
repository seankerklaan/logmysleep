import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/diary" 
                  className={`text-gray-600 hover:text-indigo-600 transition-colors ${
                    location.pathname === '/diary' ? 'text-indigo-600' : ''
                  }`}
                >
                  Sleep Diary
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/settings"
                    className={`flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors ${
                      location.pathname === '/settings' ? 'text-indigo-600' : ''
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <span className="text-gray-600">
                    {user?.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/diary" 
                    className={`text-gray-600 hover:text-indigo-600 transition-colors ${
                      location.pathname === '/diary' ? 'text-indigo-600' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sleep Diary
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors ${
                      location.pathname === '/settings' ? 'text-indigo-600' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-600">
                      {user?.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;