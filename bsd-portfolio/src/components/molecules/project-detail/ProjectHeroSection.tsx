import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Award, Target, ExternalLink, Github, Eye, BookOpen, FileText } from 'lucide-react';
import { Button } from '../../ui/button';

interface ProjectData {
  title: string;
  subtitle: string;
  timeline: string;
  team: string;
  budget: string;
  client: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
    documentation?: string;
    case_study?: string;
  };
}

interface ProjectHeroSectionProps {
  project: ProjectData;
}

const ProjectHeroSection: React.FC<ProjectHeroSectionProps> = ({ project }) => {
  // Ensure links is always an object
  const links = project.links || {};
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-20 relative"
    >
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-3xl" />
      
      <div className="relative z-10 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border rounded-3xl p-12 anime-shadow">
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold hierarchy-primary mb-6"
        >
          {project.title}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl hierarchy-secondary mb-8 max-w-4xl mx-auto"
        >
          {project.subtitle}
        </motion.p>
        
        {/* Project Meta Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
        >
          <div className="text-center">
            <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="hierarchy-primary font-semibold">{project.timeline}</div>
            <div className="hierarchy-tertiary text-sm">Duration</div>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="hierarchy-primary font-semibold">{project.team}</div>
            <div className="hierarchy-tertiary text-sm">Team Size</div>
          </div>
          <div className="text-center">
            <Award className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="hierarchy-primary font-semibold">{project.budget}</div>
            <div className="hierarchy-tertiary text-sm">Budget</div>
          </div>
          <div className="text-center">
            <Target className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="hierarchy-primary font-semibold">{project.client}</div>
            <div className="hierarchy-tertiary text-sm">Client</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {links.live && (
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground px-8 py-4 text-lg anime-shadow"
              onClick={() => window.open(links.live, '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Live URL
            </Button>
          )}
          {links.github && (
            <Button 
              size="lg"
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg"
              onClick={() => window.open(links.github, '_blank')}
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          )}
          {links.documentation && (
            <Button 
              size="lg"
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
              onClick={() => window.open(links.documentation, '_blank')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Documentation
            </Button>
          )}
          {links.case_study && (
            <Button 
              size="lg"
              variant="outline" 
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-4 text-lg"
              onClick={() => window.open(links.case_study, '_blank')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Case Study
            </Button>
          )}
          {links.demo && (
            <Button 
              size="lg"
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg"
              onClick={() => window.open(links.demo, '_blank')}
            >
              <Eye className="w-5 h-5 mr-2" />
              Demo
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectHeroSection;