import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarItem } from '../molecules/SidebarItem';
import { LogoIcon, DashboardIcon, ProjectsIcon, SettingsIcon, LogoutIcon, MenuIcon } from '../atoms/Icons';
import './Sidebar.css';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
  onMobileMenuChange?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange, onMobileMenuChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ProjectsIcon />, label: 'Projects', path: '/dashboard/projects' },
    { icon: <SettingsIcon />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const displayName = user?.full_name || user?.username || 'Admin';

  const toggleSidebar = () => {
    if (isMobile) {
      const newState = !mobileOpen;
      setMobileOpen(newState);
      onMobileMenuChange?.(newState);
    } else {
      const newState = !collapsed;
      setCollapsed(newState);
      onCollapseChange?.(newState);
    }
  };

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  useEffect(() => {
    onMobileMenuChange?.(mobileOpen);
  }, [mobileOpen, onMobileMenuChange]);

  // Close mobile menu when navigating
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
      onMobileMenuChange?.(false);
    }
  }, [location.pathname]);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
        {!collapsed && (
          <div className="sidebar-logo">
            <LogoIcon className="logo-icon" size={32} />
            <div className="logo-text">
              <h2 className="logo-title">BSD Admin</h2>
              <p className="logo-subtitle">Portfolio</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="sidebar-logo-collapsed">
            <LogoIcon className="logo-icon" size={32} />
          </div>
        )}
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              collapsed={collapsed}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{displayName}</p>
              <p className="user-role">{user?.role || 'Admin'}</p>
            </div>
          </div>
        )}
        <SidebarItem
          icon={<LogoutIcon />}
          label="Logout"
          collapsed={collapsed}
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
export type { SidebarProps };
