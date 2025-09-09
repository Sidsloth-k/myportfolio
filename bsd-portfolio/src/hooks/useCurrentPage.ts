export function useCurrentPage(pathname: string) {
  if (pathname === '/' || pathname === '/home') return 'home';
  if (pathname === '/about') return 'about';
  if (pathname === '/skills') return 'skills';
  if (pathname === '/projects') return 'projects';
  if (pathname === '/contact') return 'contact';
  if (pathname.startsWith('/projects/')) return 'projects';
  return 'home';
}


