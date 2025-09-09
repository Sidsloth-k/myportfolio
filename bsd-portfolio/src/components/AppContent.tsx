import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navigation from './Navigation';
import { ContactPage, HomePage, AboutPage, SkillsPage, ProjectsPage, ProjectPage } from '../pages';
import CharacterPopupSystem from './CharacterPopupSystem';
import RotatingAdminButton from './RotatingAdminButton';
import LoadingScreen from './app/LoadingScreen';
import BackgroundParticles from './app/BackgroundParticles';
import PageWrapper from './app/PageWrapper';
import SiteFooter from './app/SiteFooter';
import { UiProject } from '../utils/projects';
import { useProjectsList } from '../hooks/useProjectsList';
import { useProjectDetailCache } from '../hooks/useProjectDetailCache';
import { useCurrentPage } from '../hooks/useCurrentPage';
import { useInitialLoadingDelay } from '../hooks/useInitialLoadingDelay';
import { useProjectDetailRoute } from '../hooks/useProjectDetailRoute';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const skipProjectsList = location.pathname.startsWith('/projects/');
  const { projects, hasFetched: hasFetchedProjects, initialFetchMs } = useProjectsList(skipProjectsList);
  const { projectDetailCache, fetchProjectDetail, lastDetailFetchMsRef } = useProjectDetailCache();

  const currentPage = useCurrentPage(location.pathname);

  const { isLoading, setIsLoading } = useInitialLoadingDelay(hasFetchedProjects, initialFetchMs);

  const findProjectInState = (idNum: number) => projects.find(p => p.id === idNum) || (projectDetailCache as any)[idNum] || null;

  const { selectedProject, setSelectedProject, detailLoading } = useProjectDetailRoute({
    projects,
    findProjectInState,
    fetchProjectDetail,
    lastDetailFetchMsRef,
  });

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
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
  );
};

export default AppContent;