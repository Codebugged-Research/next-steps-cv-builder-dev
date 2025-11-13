import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';


const Login = ({ onLogin, onNavigateToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', formData, { withCredentials: true });
      console.log(response.data);
      toast.success('Login successful! Welcome back.');
      onLogin(response.data.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        toast.error(err.response.data?.message || 'Login failed');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#04445E] to-[#169AB4] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img
              src="/NEXT-STEPS-LOGO.png"
              alt="Next Steps Logo"
              className="h-16 mx-auto mb-4"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#04445E] mb-2">
            Login to Your USMLE CV Portal
          </h1>
          <p className="text-gray-600">
            Create your professional medical CV
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              User ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email or user ID"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#169AB4] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#169AB4] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.email.trim() || !formData.password.trim()}
            className="w-full bg-[#04445E] text-white py-3 rounded-lg font-medium hover:bg-[#033a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center space-y-4 mt-6">
          <button
            onClick={onNavigateToRegister}
            className="text-[#169AB4] hover:text-[#147a8f] font-medium transition-colors"
          >
            New Registration
          </button>
          <div>
            <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Copyright © Next Steps 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;