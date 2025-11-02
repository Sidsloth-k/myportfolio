import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <i className={`bx bx-grid-alt ${className}`} style={{ fontSize: size }}></i>
);

export const ProjectsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <i className={`bx bx-folder ${className}`} style={{ fontSize: size }}></i>
);

export const SettingsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <i className={`bx bx-cog ${className}`} style={{ fontSize: size }}></i>
);

export const LogoutIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <i className={`bx bx-log-out ${className}`} style={{ fontSize: size }}></i>
);

export const MenuIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <i className={`bx bx-menu ${className}`} style={{ fontSize: size }}></i>
);



