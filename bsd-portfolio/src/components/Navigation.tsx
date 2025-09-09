import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Home, User, Code, Briefcase, Mail } from 'lucide-react';
import { NavbarThemeToggle } from './ThemeProvider';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Mobile Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-card/95 backdrop-blur-md border-b border-border anime-shadow' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick('home')}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center anime-shadow">
                  <span className="text-primary-foreground font-bold text-lg">S</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold hierarchy-primary">Sidney</h1>
                  <p className="text-xs hierarchy-secondary">Detective Agency</p>
                </div>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    currentPage === item.id
                      ? 'text-accent bg-accent/10 anime-shadow'
                      : 'hierarchy-primary hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  
                  {currentPage === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <NavbarThemeToggle />

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 bg-card/90 backdrop-blur-md border border-border rounded-lg flex items-center justify-center hover:bg-accent/20 transition-all duration-300 anime-shadow"
              >
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 bg-card/95 backdrop-blur-md border-l border-border anime-shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-20">
                <div className="space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                        currentPage === item.id
                          ? 'bg-accent text-accent-foreground anime-shadow'
                          : 'hierarchy-primary hover:bg-accent/10 hover:text-accent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentPage === item.id 
                          ? 'bg-accent-foreground/20' 
                          : 'bg-primary/20'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-lg">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-border"
                >
                  <div className="text-center">
                    <div className="hierarchy-primary font-medium mb-1">Armed Detective Agency</div>
                    <div className="hierarchy-tertiary text-sm">Portfolio Navigation</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
    </>
  );
};

export default Navigation;