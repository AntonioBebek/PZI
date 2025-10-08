import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validacija
    if (!email || !password) {
      setError('Molim unesite email i lozinku');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
      resetForm();
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Neispravni podaci za prijavu');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email adresa je već u upotrebi');
      } else if (err.code === 'auth/invalid-email') {
        setError('Neispravna email adresa');
      } else if (err.code === 'auth/weak-password') {
        setError('Lozinka je previše slaba');
      } else {
        setError(isLogin ? 'Greška prilikom prijave' : 'Greška prilikom registracije');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@fpmoz.sum.ba');
      setPassword('admin123');
    } else {
      setEmail('user@test.com');
      setPassword('user123');
    }
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card max-w-md w-full animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <span>{isLogin ? 'Prijava' : 'Registracija'}</span>
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demo credentials */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">🚀 Demo pristup:</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="flex-1 text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 transition-colors"
            >
              👑 Admin pristup
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('user')}
              className="flex-1 text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors"
            >
              👤 Korisnik
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email adresa
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="vaš@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Lozinka
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder={isLogin ? 'Vaša lozinka' : 'Najmanje 6 karaktera'}
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Lozinka mora sadržavati najmanje 6 karaktera
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full flex items-center justify-center space-x-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Molim sačekajte...</span>
              </>
            ) : (
              <span>{isLogin ? 'Prijavi se' : 'Registriraj se'}</span>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={switchMode}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            {isLogin 
              ? "Nemate račun? Registriraj te se" 
              : "Već imate račun? Prijavi te se"
            }
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {isLogin 
              ? "Prijavite se da biste mogli dodavati, uređivati i ocjenjivati ture."
              : "Registracijom prihvaćate naše uvjete korištenja i pravila privatnosti."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;