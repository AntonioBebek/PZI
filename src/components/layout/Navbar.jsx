import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, MapPin, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Greška pri odjavi:', error);
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 text-white hover:text-cyan-300 transition-colors group">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">Hercegovina</div>
                <div className="text-xs text-cyan-200">Tours</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive('/') 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Početna
              </Link>

              {user && (
                <Link
                  to="/my-tours"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/my-tours') 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Moje ture
                </Link>
              )}

              {isAdmin() && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center ${
                    isActive('/admin') 
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-white shadow-lg backdrop-blur-sm border border-yellow-400/30' 
                      : 'text-yellow-200 hover:text-yellow-100 hover:bg-yellow-400/10'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              )}
            </div>

            {/* User Menu */}
            <div className="relative flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-white">{user.email}</div>
                    <div className="text-xs text-cyan-200">
                      {isAdmin() ? '👑 Administrator' : '👤 Korisnik'}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Odjava</span>
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={handleAuthClick}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-cyan-300 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Prijava</span>
                  </button>
                  
                  <button
                    onClick={handleAuthClick}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Registracija</span>
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 animate-slide-up bg-white/5 backdrop-blur-sm rounded-lg mt-2 border border-white/10">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  isActive('/') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                🏠 Početna
              </Link>

              {user && (
                <Link
                  to="/my-tours"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/my-tours') 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🎯 Moje ture
                </Link>
              )}

              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/admin') 
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-white border border-yellow-400/30' 
                      : 'text-yellow-200 hover:text-yellow-100 hover:bg-yellow-400/10'
                  }`}
                >
                  👑 Admin Panel
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                  <button
                    onClick={handleAuthClick}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Prijava</span>
                  </button>
                  
                  <button
                    onClick={handleAuthClick}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Registracija</span>
                  </button>
                </div>
              )}

              {user && (
                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="px-4 py-2 text-sm text-white/70">
                    Prijavljeni kao: <span className="text-white font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="inline-block h-4 w-4 mr-2" />
                    Odjava
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;
