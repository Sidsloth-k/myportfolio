import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navigation from './Navigation';
import { ContactPage, HomePage, AboutPage, SkillsPage, ProjectsPage, ProjectPage } from '../pages';
import CharacterPopupSystem from './CharacterPopupSystem';
import LoadingScreen from './app/LoadingScreen';
import BackgroundParticles from './app/BackgroundParticles';
import PageWrapper from './app/PageWrapper';
import SiteFooter from './app/SiteFooter';
import CacheInitializer from './CacheInitializer';
import { UiProject } from '../utils/projects';
import { useProjectsList } from '../hooks/useProjectsList';
import { useProjectDetailCache } from '../hooks/useProjectDetailCache';
import { useCurrentPage } from '../hooks/useCurrentPage';
import { useInitialLoadingDelay } from '../hooks/useInitialLoadingDelay';
import { useProjectDetailRoute } from '../hooks/useProjectDetailRoute';
import { encryptId } from '../utils/encryption';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const skipProjectsList = false; // Always fetch projects list to ensure findProjectInState works
  const { projects, hasFetched: hasFetchedProjects, initialFetchMs } = useProjectsList(skipProjectsList);
  const { projectDetailCache, fetchProjectDetail, lastDetailFetchMsRef, projectDetailCacheRef } = useProjectDetailCache();

  const currentPage = useCurrentPage(location.pathname);

  const findProjectInState = useCallback((idNum: number) => projects.find(p => p.id === idNum) || (projectDetailCacheRef.current as any)[idNum] || null, [projects]);

  const { selectedProject, setSelectedProject, detailLoading } = useProjectDetailRoute({
    projects,
    findProjectInState,
    fetchProjectDetail,
    lastDetailFetchMsRef,
  });

  const { isLoading, setIsLoading } = useInitialLoadingDelay(hasFetchedProjects, initialFetchMs);

  const handleProjectClick = (projectId: number) => {
    const encryptedId = encryptId(projectId);
    navigate(`/projects/${encryptedId}`);
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const setCurrentPage = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  

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
    <CacheInitializer>
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

              {!selectedProject && (
                <SiteFooter onNavigate={setCurrentPage} />
              )}

              {/* Character Popup System */}
              <CharacterPopupSystem />

              <BackgroundParticles />
            </div>
          )}
        </div>
    </CacheInitializer>
  );
};

export default AppContent;