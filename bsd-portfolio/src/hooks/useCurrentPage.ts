export function useCurrentPage(pathname: string) {
  if (pathname === '/' || pathname === '/home') return 'home';
  if (pathname === '/about') return 'about';
  if (pathname === '/skills') return 'skills';
  if (pathname === '/projects') return 'projects';
  if (pathname === '/contact') return 'contact';
  if (pathname.startsWith('/projects/')) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 2 && parts[0] === 'projects') {
      return 'project-detail';
    }
    return 'projects';
  }
  return 'home';
}


