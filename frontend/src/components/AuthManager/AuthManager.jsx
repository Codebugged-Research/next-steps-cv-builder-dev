import React, { useState, useEffect } from 'react';
import Login from '../../pages/Login/Login.jsx';
import Register from '../../pages/Register/Register.jsx';
import DashboardLayout from '../../pages/Dashboard/Dashboard.jsx';
import api from '../../services/api.js';
import { toast } from 'react-toastify';

const AuthManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    
    const handleSessionExpired = () => {
      handleSessionExpiration();
    };
    
    window.addEventListener('session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const sessionExpired = localStorage.getItem('sessionExpired') === 'true';
      if (sessionExpired) {
        localStorage.removeItem('sessionExpired');
        toast.info('Please login to continue', {
          position: 'top-center',
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      const wasLoggedOut = localStorage.getItem('wasLoggedOut') === 'true';
      
      if (wasLoggedOut) {
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);

      const response = await api.get('/users/current-user', { withCredentials: true });
      
      if (response.data.success) {
        const freshUserData = response.data.data;
        setUser(freshUserData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(freshUserData));
        localStorage.removeItem('wasLoggedOut');
      } else {
        throw new Error('Token invalid');
      }
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('wasLoggedOut');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpiration = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('activeSection');
    localStorage.removeItem('currentCVStep');
    localStorage.removeItem('completedSteps');
    
    setUser(null);
    setIsAuthenticated(false);
    setShowRegister(false);
  };

  const handleLogin = (userData) => {
    const actualUser = userData.user || userData;
    setUser(actualUser);
    setIsAuthenticated(true);
    setShowRegister(false);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('wasLoggedOut');
    localStorage.removeItem('sessionExpired');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('wasLoggedOut');
    localStorage.removeItem('sessionExpired');
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.setItem('wasLoggedOut', 'true');
      localStorage.removeItem('user');
      localStorage.removeItem('activeSection');
      localStorage.removeItem('currentCVStep');
      localStorage.removeItem('completedSteps');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-[#04445E]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        onNavigateToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onNavigateToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />;
};

export default AuthManager;