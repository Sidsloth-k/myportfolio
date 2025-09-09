import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Card } from '../../ui/card';
import { ProjectDetailBackground, ProjectBackButton } from '../../atoms/project-detail';
import { 
  ProjectHeroSection, 
  EnhancedImageGallery,
  TechnicalStackShowcase,
  CompactRoadmapFlow,
  MetricsShowcase
} from '../../molecules/project-detail';

interface ProjectDetailPageProps {
  project: any;
  onBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const isInView = useInView(containerRef, { once: true });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Map dynamic backend fields to what subcomponents expect
  const detail = {
    title: project?.title || '',
    subtitle: project?.subtitle || '',
    category: project?.category || '',
    description: project?.description || '',
    longDescription: project?.long_description || project?.longDescription || project?.description || '',
    timeline: project?.timeline || '',
    team: project?.team || '',
    role: project?.role || '',
    budget: project?.budget || '',
    client: project?.client || '',
    technologies: Array.isArray(project?.technologies_detailed)
      ? project.technologies_detailed
      : Array.isArray(project?.technologies)
        ? project.technologies.map((t: any) => ({ name: t.name, category: t.category, level: t.level, icon: t.icon }))
        : Array.isArray(project?.technologies_names)
          ? project.technologies_names.map((name: string) => ({ name, category: '', level: '', icon: '' }))
          : [],
    images: Array.isArray(project?.images)
      ? project.images.map((img: any) => ({ url: img.url, caption: img.caption || '', type: img.type || 'screenshot' }))
      : [],
    roadmap: Array.isArray(project?.roadmap)
      ? project.roadmap.map((p: any) => ({
          phase: p.phase,
          description: p.description,
          duration: p.duration,
          deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
          challenges: Array.isArray(p.challenges) ? p.challenges : [],
          solutions: Array.isArray(p.solutions) ? p.solutions : [],
          status: p.status
        }))
      : [],
    testimonials: Array.isArray(project?.testimonials)
      ? project.testimonials.map((t: any) => ({
          name: t.name,
          role: t.role,
          company: t.company,
          quote: t.quote,
          rating: t.rating
        }))
      : [],
    links: project?.links || {},
    metrics: Array.isArray(project?.metrics)
      ? project.metrics.reduce((acc: any, m: any) => { if (m?.key) acc[m.key] = m.value; return acc; }, {})
      : {},
  };

  const hasOverview = detail.longDescription || detail.role;
  const hasImages = detail.images && detail.images.length > 0;
  const hasTech = detail.technologies && detail.technologies.length > 0;
  const hasRoadmap = detail.roadmap && detail.roadmap.length > 0;
  const hasMetricsOrTestimonials = (detail.metrics && Object.keys(detail.metrics).length > 0) || (detail.testimonials && detail.testimonials.length > 0);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      <ProjectDetailBackground y1={y1} y2={y2} opacity={opacity} />

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
        <ProjectBackButton onBack={onBack} />

        {/* Project Hero Section */}
        <ProjectHeroSection project={detail} />

        {/* Project Overview */}
        {hasOverview && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <Card className="p-10 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border anime-shadow">
            <h3 className="text-3xl font-bold hierarchy-primary mb-6">Project Overview</h3>
              {detail.longDescription && (
            <p className="text-lg leading-relaxed hierarchy-secondary mb-6">
                  {detail.longDescription}
            </p>
              )}
              {detail.role && (
            <div className="text-lg font-semibold hierarchy-primary">
                  Role: <span className="text-accent">{detail.role}</span>
            </div>
              )}
          </Card>
        </motion.div>
        )}
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {hasImages && <EnhancedImageGallery images={detail.images} isInView={isInView} />}
        {hasTech && <TechnicalStackShowcase technologies={detail.technologies} isInView={isInView} />}
        {hasRoadmap && <CompactRoadmapFlow roadmap={detail.roadmap} isInView={isInView} />}
        {hasMetricsOrTestimonials && (
          <MetricsShowcase 
            metrics={Object.entries(detail.metrics).map(([metric, value]: any) => ({ metric, value }))}
            testimonials={detail.testimonials}
            isInView={isInView}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;