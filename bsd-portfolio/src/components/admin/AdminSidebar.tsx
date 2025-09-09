import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Code, 
  BarChart3, 
  Settings, 
  X, 
  LogOut,
  Shield,
  Home
} from 'lucide-react';
import { Button } from '../ui/button';

interface AdminSidebarProps {
  onLogout: () => void;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      description: 'Overview and stats'
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      path: '/admin/content',
      description: 'Text and pages'
    },
    {
      id: 'media',
      label: 'Media',
      icon: Image,
      path: '/admin/media',
      description: 'Images and files'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Code,
      path: '/admin/projects',
      description: 'Portfolio projects'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      description: 'Visitor insights'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      description: 'Site configuration'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="w-80 bg-card/95 backdrop-blur-md border-r border-border h-full flex flex-col anime-shadow"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Portfolio Management</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
          <div className="text-sm text-foreground font-medium">Armed Detective Agency</div>
          <div className="text-xs text-muted-foreground">Content Management System</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Management
        </div>
        
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 group ${
              isActive(item.path)
                ? 'bg-primary text-primary-foreground anime-shadow'
                : 'hover:bg-muted/50 text-foreground'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isActive(item.path)
                ? 'bg-primary-foreground/20'
                : 'bg-accent/20 group-hover:bg-accent/30'
            }`}>
              <item.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 text-left">
              <div className="font-medium">{item.label}</div>
              <div className={`text-xs ${
                isActive(item.path) ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {item.description}
              </div>
            </div>
            
            {isActive(item.path) && (
              <motion.div
                layoutId="activeIndicator"
                className="w-1 h-8 bg-primary-foreground/50 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onClose}
        >
          <Home className="w-4 h-4 mr-3" />
          Back to Portfolio
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
        
        <div className="text-xs text-muted-foreground text-center pt-4">
          <div>Admin Panel v2.0</div>
          <div>© 2024 Sidney's Portfolio</div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;