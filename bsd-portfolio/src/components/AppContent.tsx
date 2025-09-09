import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navigation from './Navigation';
import { ContactPage, HomePage, AboutPage, SkillsPage, ProjectsPage, ProjectPage } from '../pages';
import CharacterPopupSystem from './CharacterPopupSystem';
import RotatingAdminButton from './RotatingAdminButton';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Project shape expected by UI components
  interface Project {
    id: number;
    title: string;
    category: string;
    type: string;
    description: string;
    technologies: string[];
    image: string;
    github: string;
    live: string;
    highlight?: string;
    stats: Record<string, string | undefined>;
    // Optionally include full detail fields to pass through
    subtitle?: string | null;
    long_description?: string | null;
    timeline?: string | null;
    team?: string | null;
    role?: string | null;
    budget?: string | null;
    client?: string | null;
    images?: any[];
    features?: any[];
    roadmap?: any[];
    testimonials?: any[];
    metrics?: any[];
    skills?: any[];
    // Detailed technologies for detail pages (non-breaking for list UI)
    technologies_detailed?: Array<{
      name: string;
      category: string;
      level: string;
      icon: string;
      levelPercent?: number;
      level_percent?: number;
      proficiency?: number;
      score?: number;
      level_min?: number;
      level_max?: number;
    }>;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(false);
  const [hasFetchedProjects, setHasFetchedProjects] = useState<boolean>(false);
  const [initialFetchMs, setInitialFetchMs] = useState<number>(2500);
  const lastDetailFetchMsRef = useRef<number>(0);
  const lastProjectsFetchAtRef = useRef<number>(0);
  const PROJECTS_TTL_MS = 5 * 60 * 1000; // 5 minutes
  const DETAIL_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // Cache for detailed project payloads
  const [projectDetailCache, setProjectDetailCache] = useState<Record<number, any>>({});
  const inFlightDetailPromisesRef = useRef<Partial<Record<number, Promise<any>>>>({});
  const baseUrl = useMemo(() => (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, ''), []);

  // Get current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/about') return 'about';
    if (path === '/skills') return 'skills';
    if (path === '/projects') return 'projects';
    if (path === '/contact') return 'contact';
    if (path.startsWith('/projects/')) return 'projects';
    return 'home';
  };

  const currentPage = getCurrentPage();

  // Map backend project to UI shape without changing any UI components
  const mapBackendProjectToUi = (p: any): Project => {
    const statsObject: Record<string, string | undefined> = Array.isArray(p?.stats)
      ? p.stats.reduce((acc: Record<string, string | undefined>, s: any) => {
          if (s && s.key) acc[s.key] = s.value;
          return acc;
        }, {})
      : {};

    const technologiesNames: string[] = Array.isArray(p?.technologies_names) ? p.technologies_names : [];
    const technologiesDetailed = Array.isArray(p?.technologies)
      ? p.technologies.map((t: any) => ({
          name: t.name,
          category: t.category,
          level: t.level,
          icon: t.icon,
          levelPercent: t.levelPercent,
          level_percent: t.level_percent,
          level_label: t.level_label,
          proficiency: t.proficiency,
          score: t.score,
          level_min: t.level_min,
          level_max: t.level_max,
        }))
      : [];

    const imageUrl = p?.cover_image_url
      || (Array.isArray(p?.images) && p.images.length > 0 ? p.images[0]?.url || '' : '')
      || '';

    const links = p?.links || {};

    return {
      id: Number(p?.id),
      title: p?.title || '',
      category: p?.category || 'it',
      type: p?.type || '',
      description: p?.description || '',
      technologies: technologiesNames,
      image: imageUrl,
      github: links.github || '',
      live: links.live || links.demo || '',
      highlight: p?.highlight || undefined,
      stats: statsObject,
      // pass through optional detail fields if present
      subtitle: p?.subtitle ?? null,
      long_description: p?.long_description ?? null,
      timeline: p?.timeline ?? null,
      team: p?.team ?? null,
      role: p?.role ?? null,
      budget: p?.budget ?? null,
      client: p?.client ?? null,
      images: Array.isArray(p?.images) ? p.images : [],
      features: Array.isArray(p?.features) ? p.features : [],
      roadmap: Array.isArray(p?.roadmap) ? p.roadmap : [],
      testimonials: Array.isArray(p?.testimonials) ? p.testimonials : [],
      metrics: Array.isArray(p?.metrics) ? p.metrics : [],
      skills: Array.isArray(p?.skills) ? p.skills : [],
      technologies_detailed: technologiesDetailed.length ? technologiesDetailed : undefined
    };
  };

  // Fetch projects from backend with TTL caching
  useEffect(() => {
    let isMounted = true;
    // Skip list fetch on direct project detail routes to avoid double fetching
    if (location.pathname.startsWith('/projects/')) {
      return () => { isMounted = false; };
    }

    // If we already fetched and cache is still fresh, skip
    const now = Date.now();
    if (hasFetchedProjects && now - lastProjectsFetchAtRef.current < PROJECTS_TTL_MS) {
      return () => { isMounted = false; };
    }

    const fetchProjects = async () => {
      try {
        setIsFetchingProjects(true);
        const t0 = performance.now();
        const res = await fetch(`${baseUrl}/api/projects`, { credentials: 'include' });
        const json = await res.json();
        const list: any[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = list.map(mapBackendProjectToUi).filter(p => p && Number.isFinite(p.id));
        const uniqueById = Array.from(new Map(mapped.map(p => [p.id, p])).values());
        if (isMounted) {
          setProjects(uniqueById);
          lastProjectsFetchAtRef.current = Date.now();
        }
        const duration = Math.max(0, performance.now() - t0);
        if (isMounted) setInitialFetchMs(duration);
      } catch (err) {
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) {
          setIsFetchingProjects(false);
          setHasFetchedProjects(true);
        }
      }
    };

    fetchProjects();
    return () => { isMounted = false; };
  }, [baseUrl, location.pathname, hasFetchedProjects]);

  // Ensure fullscreen loading covers until fetch is done; adapt to measured network time
  useEffect(() => {
    const minimumDurationMs = 1200; // not too fast
    const extraAnimationBufferMs = 400; // let entrance animations breathe
    const targetDuration = Math.max(minimumDurationMs, Math.min(6000, initialFetchMs + extraAnimationBufferMs));

    let timeoutId: any;
    if (hasFetchedProjects) {
      timeoutId = setTimeout(() => setIsLoading(false), targetDuration);
    }
    return () => clearTimeout(timeoutId);
  }, [hasFetchedProjects, initialFetchMs]);

  const findProjectInState = (idNum: number) => projects.find(p => p.id === idNum) || projectDetailCache[idNum] || null;

  // Fetch single project detail with cache
  const fetchProjectDetail = async (idNum: number) => {
    // Serve from cache if fresh
    const cached = projectDetailCache[idNum];
    const cachedAtKey = `__at_${idNum}`;
    const cachedAt = (projectDetailCache as any)[cachedAtKey] as number | undefined;
    if (cached && cachedAt && Date.now() - cachedAt < DETAIL_TTL_MS) return cached;

    const inflight = inFlightDetailPromisesRef.current[idNum];
    if (inflight) return inflight;

    const promise = (async () => {
      try {
        const t0 = performance.now();
        const res = await fetch(`${baseUrl}/api/projects/${idNum}`, { credentials: 'include' });
        const json = await res.json();
        const data = json?.data ? mapBackendProjectToUi(json.data) : null;
        if (data) {
          setProjectDetailCache(prev => ({ ...prev, [idNum]: data, [`__at_${idNum}`]: Date.now() } as any));
        }
        lastDetailFetchMsRef.current = Math.max(0, performance.now() - t0);
        return data;
      } catch {
        lastDetailFetchMsRef.current = 0;
        return null;
      } finally {
        delete inFlightDetailPromisesRef.current[idNum];
      }
    })();
    inFlightDetailPromisesRef.current[idNum] = promise;
    return promise;
  };

  // Handle project routing using fetched projects and detail cache
  useEffect(() => {
    if (!params.id) {
      setSelectedProject(null);
      return;
    }
    const projectId = Number(params.id);
    if (!Number.isFinite(projectId)) return;

    const existing = findProjectInState(projectId);
    if (existing) {
      setSelectedProject(existing);
      const needsEnrich = (!existing.technologies || (Array.isArray(existing.technologies) && existing.technologies.length > 0 && typeof existing.technologies[0] === 'string'))
        || !existing.images || !existing.roadmap || !existing.metrics || !existing.testimonials;
      if (needsEnrich && !projectDetailCache[projectId]) {
        (async () => {
          const detail = await fetchProjectDetail(projectId);
          if (detail) setSelectedProject(detail);
        })();
      }
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const detail = await fetchProjectDetail(projectId);
      const minimumDetailMs = 800;
      const bufferMs = 300;
      const delay = Math.max(minimumDetailMs, Math.min(4000, lastDetailFetchMsRef.current + bufferMs));
      setTimeout(() => {
        if (!cancelled) {
          if (detail) setSelectedProject(detail);
          else navigate('/projects');
          setIsLoading(false);
        }
      }, delay);
    })();
    return () => { cancelled = true; };
  // remove projects from deps to avoid re-trigger on list updates when on detail route
  }, [params.id, navigate]);

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const setCurrentPage = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  // Enhanced Loading Screen Component (unchanged visuals)
  const LoadingScreen = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-background via-card to-muted flex items-center justify-center overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: [null, -150],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Enhanced Dazai-inspired loading animation */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-10 relative overflow-hidden anime-glow"
        >
          {/* Enhanced bandage effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent via-primary to-background opacity-80"></div>
          <motion.div 
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 left-3 w-16 h-1 bg-background opacity-70 rounded transform rotate-12"
          />
          <motion.div 
            animate={{ rotate: [0, -90, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-6 right-3 w-10 h-1 bg-background opacity-70 rounded transform -rotate-12"
          />
          
          {/* Ability nullification effect */}
          <motion.div
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1.5
            }}
            className="absolute inset-0 border-2 border-accent/50 rounded-full"
          />
          
          {/* Inner rotating element */}
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border-2 border-background/30 rounded-full"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold hierarchy-primary mb-6"
        >
          Armed Detective Agency
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="hierarchy-secondary text-xl mb-10"
        >
          Loading Sidney's Portfolio...
        </motion.p>

        {/* Enhanced loading dots with power effects */}
        <div className="flex justify-center space-x-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full"
            />
          ))}
        </div>

        {/* Loading progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-8 mx-auto max-w-md"
        />

        {/* Loading quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 italic text-accent text-lg max-w-lg mx-auto bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border"
        >
          "Every masterpiece begins with a single stroke, every mystery with a single clue..."
          <div className="text-sm font-semibold mt-2 hierarchy-primary">— Dazai Osamu</div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Page Component Wrapper - removed animations to prevent reload issues
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen">
      {children}
    </div>
  );

  // Render different pages based on currentPage
  const renderPage = () => {
    // If a project is selected, show project detail page
    if (selectedProject) {
      return (
        <ProjectPage 
          project={selectedProject} 
          onBack={handleBackToProjects}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <PageWrapper>
            <HomePage 
              onViewMoreSkills={() => setCurrentPage('skills')}
              onViewAllProjects={() => setCurrentPage('projects')}
              onProjectClick={handleProjectClick}
              projects={projects}
            />
          </PageWrapper>
        );
      case 'about':
        return (
          <PageWrapper>
            <AboutPage />
          </PageWrapper>
        );
      case 'skills':
        return (
          <PageWrapper>
            <SkillsPage onProjectClick={handleProjectClick} />
          </PageWrapper>
        );
      case 'projects':
        return (
          <PageWrapper>
            <ProjectsPage 
              projects={projects} 
              onProjectClick={handleProjectClick}
            />
          </PageWrapper>
        );
      case 'contact':
        return (
          <div className="pt-20">
            <ContactPage />
          </div>
        );
      default:
        return (
          <PageWrapper>
            <HomePage 
              onViewMoreSkills={() => setCurrentPage('skills')}
              onViewAllProjects={() => setCurrentPage('projects')}
              onProjectClick={handleProjectClick}
              projects={projects}
            />
          </PageWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Main Application */}
      {!isLoading && (
        <div key="main-app">
            {/* Navigation - hide on project detail page */}
            {!selectedProject && (
              <Navigation 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
            )}

            {/* Page Content */}
            <main className="relative z-10">
              {renderPage()}
            </main>

            {/* Enhanced Footer - hide on project detail page */}
            {!selectedProject && (
              <motion.footer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-gradient-to-r from-card to-muted border-t border-border py-12 px-6 relative overflow-hidden z-10"
              >
                {/* Footer Background Effects */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Agency Info */}
                    <div className="md:col-span-2">
                      <motion.h3 
                        whileHover={{ scale: 1.02 }}
                        className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                      >
                        Armed Detective Agency
                      </motion.h3>
                      <p className="hierarchy-secondary mb-6 leading-relaxed text-lg">
                        Solving digital mysteries with the precision of detective work 
                        and the creativity of literary mastery. Sidney brings together 
                        IT expertise, design elegance, and marketing strategy to create 
                        solutions that inspire and deliver results.
                      </p>
                      <div className="italic text-accent text-lg bg-accent/10 p-4 rounded-xl border border-accent/20">
                        "Every project is a story waiting to be told, every challenge a mystery waiting to be solved."
                        <div className="text-sm font-semibold mt-2 hierarchy-primary">— Dazai Osamu</div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h4 className="text-xl font-semibold mb-6 text-accent">
                        Case Files
                      </h4>
                      <div className="space-y-3">
                        {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((link) => (
                          <motion.button
                            key={link}
                            whileHover={{ x: 8, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(link.toLowerCase())}
                            className="block hierarchy-secondary hover:text-primary transition-colors text-lg py-1"
                          >
                            {link}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info & Admin Access */}
                    <div>
                      <h4 className="text-xl font-semibold mb-6 text-accent">
                        Connect & Manage
                      </h4>
                      <div className="space-y-3 hierarchy-secondary mb-6">
                        <div className="text-lg">sidney@detective-agency.dev</div>
                        <div>Yokohama, Japan</div>
                        <div>Available 24/7 for emergencies</div>
                      </div>
                      
                      {/* Rotating Admin Access Button */}
                      <div className="mb-4">
                        <RotatingAdminButton />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="hierarchy-tertiary text-sm">
                      © 2024 Sidney's Portfolio. Inspired by Bungou Stray Dogs.
                    </div>
                    <div className="hierarchy-tertiary text-sm mt-4 md:mt-0 flex items-center space-x-2">
                      <span>Built with React, TypeScript, and Anime Magic</span>
                      <motion.span 
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-accent"
                      >
                        ✨
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.footer>
            )}

            {/* Character Popup System */}
            <CharacterPopupSystem />

            {/* Enhanced Background Particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-accent/20 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, -window.innerHeight - 100],
                    x: [null, Math.random() * 200 - 100],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 20 + Math.random() * 15,
                    repeat: Infinity,
                    delay: Math.random() * 15,
                    ease: 'linear',
                  }}
                />
              ))}

              {/* Additional floating anime elements */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`element-${i}`}
                  className="absolute w-4 h-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 100,
                    rotate: 0,
                  }}
                  animate={{
                    y: [null, -200],
                    x: [null, Math.random() * 300 - 150],
                    rotate: [0, 360],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: 12 + Math.random() * 8,
                    repeat: Infinity,
                    delay: Math.random() * 12,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

export default AppContent;