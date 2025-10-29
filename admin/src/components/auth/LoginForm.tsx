import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('LoginForm: User is authenticated, redirecting to dashboard...');
      setIsLoading(false);
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('LoginForm: Attempting login...');
      await login(username, password);
      console.log('LoginForm: Login successful, waiting for redirect...');
      // Navigation will happen via useEffect when isAuthenticated changes
    } catch (err: any) {
      console.error('LoginForm: Login error:', err);
      setError(err.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <span className="bg-animate"></span>
      <span className="bg-2-animate"></span>
      
      <div className="main-container">
        <div className="form-box login">
          <div className="animation" style={{ '--i': 0, '--j': 21 } as React.CSSProperties}>
            <h2>Login</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-box animation" style={{ '--i': 1, '--j': 22 } as React.CSSProperties}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <label>Username</label>
              <i className="bx bxs-user"></i>
            </div>

            <div className="input-box animation" style={{ '--i': 2, '--j': 23 } as React.CSSProperties}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <label>Password</label>
              <i 
                className={`bx ${showPassword ? 'bxs-hide' : 'bxs-lock-alt'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>

            {error && (
              <div className="error-message animation" style={{ '--i': 3, '--j': 24 } as React.CSSProperties}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn animation"
              disabled={isLoading}
              style={{ '--i': 4, '--j': 25 } as React.CSSProperties}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
