import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Demo credentials (in real app, this would be handled by backend)
  const DEMO_CREDENTIALS = {
    username: 'dazai',
    password: 'nullify'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.username === DEMO_CREDENTIALS.username && 
        formData.password === DEMO_CREDENTIALS.password) {
      // Success
      setIsLoading(false);
      onLogin(true);
    } else {
      // Failed
      setIsLoading(false);
      setAttempts(prev => prev + 1);
      setError('Invalid credentials. Access denied.');
      
      // Reset form after failed attempt
      setTimeout(() => {
        setFormData({ username: '', password: '' });
        setError('');
      }, 2000);
    }
  };

  const securityTips = [
    "Username: dazai",
    "Password: nullify",
    "This is a demo login system"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              x: [null, Math.random() * 200 - 100],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: 'linear',
            }}
          />
        ))}

        {/* Background gradients */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md p-8 bg-card/90 backdrop-blur-md border border-border anime-shadow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            {/* Logo */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center relative overflow-hidden"
            >
              <Shield className="w-8 h-8 text-primary-foreground relative z-10" />
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1 border-2 border-primary-foreground/30 rounded-full"
              />
            </motion.div>

            <h1 className="text-3xl font-bold hierarchy-primary mb-2">
              Detective Access
            </h1>
            <p className="hierarchy-secondary">
              Armed Detective Agency - Secure Portal
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-accent" />
                <span>Detective ID</span>
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter detective username"
                  className="pl-10 bg-input-background border-border focus:border-accent transition-colors"
                  required
                />
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>Security Code</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter security password"
                  className="pl-10 pr-10 bg-input-background border-border focus:border-accent transition-colors"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <span className="text-destructive text-sm">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.username || !formData.password}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-4 h-4" />
                  </motion.div>
                  <span>Authenticating...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Access Secure Area</span>
                </motion.div>
              )}
              
              {/* Button glow effect */}
              <motion.div
                animate={isLoading ? {
                  x: [-100, 100],
                  opacity: [0, 0.5, 0]
                } : {}}
                transition={isLoading ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                } : {}}
                className="absolute inset-0 bg-white/20 blur-xl"
              />
            </Button>
          </motion.form>

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-muted/30 rounded-lg border border-border"
          >
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium hierarchy-primary">Demo Access Info</span>
            </div>
            <div className="space-y-1">
              {securityTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-sm hierarchy-tertiary flex items-center space-x-2"
                >
                  <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0" />
                  <span>{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Attempt Counter */}
          {attempts > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm hierarchy-tertiary"
            >
              Failed attempts: {attempts}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;