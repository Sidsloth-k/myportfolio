import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, ExternalLink, Github } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, getStatusColor, getCategoryColor, type Project } from './adminConstants';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'Detective Case Management System',
      category: 'it',
      type: 'Full-Stack Application',
      status: 'published',
      description: 'A comprehensive case management system for detective agencies...',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
      stats: { users: '500+', performance: '99.9%', data: '10TB+' },
      links: { live: 'https://demo.com', github: 'https://github.com/...' },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      title: 'Port Mafia Analytics Platform',
      category: 'it',
      type: 'Data Visualization',
      status: 'draft',
      description: 'Advanced analytics platform for organizational insights...',
      technologies: ['Python', 'FastAPI', 'React', 'D3.js'],
      stats: { models: '15', accuracy: '94%', realtime: 'Yes' },
      links: { live: '', github: 'https://github.com/...' },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 3,
      title: 'Armed Detective Agency Mobile App',
      category: 'ux',
      type: 'Mobile UI/UX',
      status: 'published',
      description: 'Elegant mobile interface for agency operations...',
      technologies: ['Figma', 'React Native', 'Framer Motion'],
      stats: { screens: '45', satisfaction: '98%', downloads: '50K+' },
      links: { live: 'https://app.com', github: '' },
      createdAt: '2024-01-05',
      updatedAt: '2024-01-16'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const handleDelete = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleStatusChange = (projectId: number, newStatus: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : p
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold hierarchy-primary mb-2"
        >
          Project Management
        </motion.h1>
        <p className="hierarchy-secondary">
          Manage portfolio projects, case studies, and their details.
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="h-full flex flex-col hover:border-accent/50 transition-all duration-300 anime-shadow">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge className={getCategoryColor(project.category)}>
                      {project.category}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-bold hierarchy-primary mb-2">{project.title}</h3>
                <p className="text-sm hierarchy-secondary mb-3">{project.type}</p>
                <p className="text-sm hierarchy-tertiary line-clamp-3">{project.description}</p>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold hierarchy-primary mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold hierarchy-primary mb-2">Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(project.stats).slice(0, 2).map(([key, value]) => (
                      <div key={key}>
                        <span className="hierarchy-tertiary">{key}:</span>
                        <span className="hierarchy-primary font-semibold ml-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  {project.links.live && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live
                    </Button>
                  )}
                  {project.links.github && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex justify-between items-center text-xs hierarchy-tertiary">
                  <span>Updated: {project.updatedAt}</span>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold hierarchy-primary mb-4">Project Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold hierarchy-primary">{projects.length}</div>
            <div className="text-sm hierarchy-tertiary">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm hierarchy-tertiary">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {projects.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-sm hierarchy-tertiary">Drafts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold hierarchy-primary">
              {Math.round(projects.filter(p => p.status === 'published').length / projects.length * 100)}%
            </div>
            <div className="text-sm hierarchy-tertiary">Published Rate</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectManager;