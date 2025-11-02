import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { encryptId } from '../../utils/encryption';
import './ProjectsListPage.css';

interface Project {
  id: number;
  title: string;
  category: string;
  type: string;
  description: string;
  cover_image_url?: string;
  highlight?: string;
  technologies?: string[];
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
}

const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getProjects();
      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedProjects: Project[] = response.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          type: p.type,
          description: p.description,
          cover_image_url: p.cover_image_url,
          highlight: p.highlight,
          technologies: p.technologies_names || [], // Use technologies_names from backend
          links: p.links || {}
        }));
        setProjects(mappedProjects);
        const uniqueCategories = Array.from(new Set(mappedProjects.map((p: Project) => p.category)));
        setCategories(uniqueCategories.sort());
      }
    } catch (err: any) {
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    const encryptedId = encryptId(id);
    navigate(`/dashboard/projects/${encryptedId}/edit`);
  };

  const handleCreate = () => {
    navigate('/dashboard/projects/new');
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await apiService.deleteProject(id);
      if (response.success) {
        loadProjects();
      } else {
        setError(response.error || 'Failed to delete project');
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  if (loading) {
    return (
      <div className="projects-list-page loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-list-page">
      {/* Header with Create Button */}
      <div className="projects-list-header">
        <div>
          <h1>Case Archives</h1>
          <p>A comprehensive collection of solved cases and investigations</p>
        </div>
        <button onClick={handleCreate} className="btn-create">
          + Create Project
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="projects-list-controls">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-filter-toggle"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {showFilters && (
          <div className="filter-section">
            <label>Filter by Category:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="btn-reset-filter"
              >
                Reset
              </button>
            )}
          </div>
        )}
        <div className="projects-count">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid - Similar to bsd-portfolio */}
      <div className="projects-grid">
        {filteredProjects.map(project => {
          const imageUrl = project.cover_image_url || '';
          const technologies = project.technologies || [];
          
          return (
            <div
              key={project.id}
              className="project-card"
              onClick={() => handleEdit(project.id)}
            >
              {/* Project Image */}
              {imageUrl && (
                <div className="project-card-image">
                  <img src={imageUrl} alt={project.title} />
                  {project.highlight && (
                    <div className="project-highlight-badge">
                      {project.highlight}
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="project-card-overlay">
                    <div className="project-card-overlay-content">
                      {project.links?.live && (
                        <button
                          className="project-link-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.links!.live, '_blank');
                          }}
                          title="View Live"
                        >
                          🔗
                        </button>
                      )}
                      {project.links?.github && (
                        <button
                          className="project-link-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.links!.github, '_blank');
                          }}
                          title="View GitHub"
                        >
                          💻
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Project Content */}
              <div className="project-card-content">
                <div className="project-card-header">
                  <h3>{project.title}</h3>
                </div>
                
                <div className="project-card-meta">
                  <span className="badge badge-category">{project.category}</span>
                  <span className="badge badge-type">{project.type}</span>
                </div>

                <p className="project-card-description">
                  {project.description.substring(0, 120)}
                  {project.description.length > 120 ? '...' : ''}
                </p>

                {/* Technologies */}
                {technologies.length > 0 && (
                  <div className="project-technologies">
                    {technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                    {technologies.length > 3 && (
                      <span className="tech-tag-more">+{technologies.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Edit Button at Bottom */}
                <div className="project-card-footer">
                  <button
                    className="btn-edit-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(project.id);
                    }}
                  >
                    Edit Project
                  </button>
                  <button
                    className="btn-delete-icon"
                    onClick={(e) => handleDelete(project.id, e)}
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <p>No projects found for the selected category.</p>
          <button onClick={handleCreate} className="btn-create">
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
