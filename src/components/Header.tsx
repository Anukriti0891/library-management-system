import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-indigo-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-serif">
            <BookOpen className="h-8 w-8 text-amber-400" />
            <span className="font-bold tracking-wide">LibraryHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-amber-300 transition duration-200">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-amber-300 transition duration-200">
                  Dashboard
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-amber-300 transition duration-200">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="hover:text-amber-300 transition duration-200">
                Login
              </Link>
            )}
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1 px-3 pr-8 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 w-40 lg:w-56"
              />
              <button type="submit" className="absolute right-2 top-1 text-gray-600">
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-amber-300 transition duration-200">
                  <User className="h-5 w-5" />
                  <span>{currentUser?.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    {currentUser?.email}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-3 pr-10 rounded-md text-gray-800"
              />
              <button type="submit" className="absolute right-3 top-2 text-gray-600">
                <Search className="h-5 w-5" />
              </button>
            </form>
            
            <Link
              to="/"
              className="block py-2 hover:text-amber-300 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 hover:text-amber-300 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block py-2 hover:text-amber-300 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 hover:text-amber-300 transition duration-200"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 hover:text-amber-300 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;