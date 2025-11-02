import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import './ProjectsPage.css';

interface ProjectFormData {
  // Core fields
  title: string;
  category: string;
  type: string;
  description: string;
  subtitle?: string;
  long_description?: string;
  timeline?: string;
  team?: string;
  role?: string;
  budget?: string;
  client?: string;
  cover_image_url?: string;
  highlight?: string;
  
  // Links
  links: {
    live?: string;
    github?: string;
    documentation?: string;
    case_study?: string;
    demo?: string;
  };
  
  // Arrays
  technologies: Array<{ skill_id: number; level?: string }>;
  images: Array<{ url: string; caption: string; type: string; order: number }>;
  features: Array<{ title: string; description: string; icon_key?: string; status: string; impact?: string; order: number }>;
  roadmap: Array<{
    phase: string;
    description: string;
    duration: string;
    status: string;
    deliverables: string[];
    challenges: string[];
    solutions: string[];
    order: number;
  }>;
  stats: Array<{ key: string; value: string; is_list_stat: boolean; order: number }>;
  metrics: Array<{ key: string; value: string; order: number }>;
  testimonials: Array<{ name: string; role: string; company: string; quote: string; rating: number; order: number }>;
  skills: Array<{ skill_id: number; contribution?: string; complexity?: string }>;
}

interface Skill {
  id: number;
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const ProjectsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    category: '',
    type: '',
    description: '',
    links: {},
    technologies: [],
    images: [],
    features: [],
    roadmap: [],
    stats: [],
    metrics: [],
    testimonials: [],
    skills: []
  });

  const projectTypes = [
    'SaaS Platform',
    'Web Application',
    'Mobile Application',
    'Desktop Application',
    'Data Science Project',
    'AI/ML Project',
    'Design System',
    'Full-Stack Application',
    'Backend System',
    'Frontend Application'
  ];

  const imageTypes = ['screenshot', 'mobile', 'design', 'other'];
  const featureStatuses = ['completed', 'in progress', 'planned'];
  const phaseStatuses = ['completed', 'in progress', 'not started'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        apiService.getSkills(),
        apiService.getProjectCategories()
      ]);

      if (skillsRes.success && skillsRes.data) {
        // Flatten skills from categories
        const allSkills: Skill[] = [];
        skillsRes.data.forEach((category: any) => {
          if (category.skills && Array.isArray(category.skills)) {
            allSkills.push(...category.skills);
          }
        });
        setSkills(allSkills);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err: any) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinksChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [field]: value
      }
    }));
  };

  const addArrayItem = (arrayName: keyof ProjectFormData, item: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[]), item]
    }));
  };

  const removeArrayItem = (arrayName: keyof ProjectFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (arrayName: keyof ProjectFormData, index: number, field: string, value: any) => {
    setFormData(prev => {
      const array = [...(prev[arrayName] as any[])];
      array[index] = { ...array[index], [field]: value };
      return {
        ...prev,
        [arrayName]: array
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    // Validation
    if (!formData.title || !formData.category || !formData.type || !formData.description) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const response = await apiService.createProject(formData);
      if (response.success) {
        setSuccess('Project created successfully!');
        // Reset form
        setFormData({
          title: '',
          category: '',
          type: '',
          description: '',
          links: {},
          technologies: [],
          images: [],
          features: [],
          roadmap: [],
          stats: [],
          metrics: [],
          testimonials: [],
          skills: []
        });
      } else {
        setError(response.error || 'Failed to create project');
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-page loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Create New Project</h1>
        <p>Fill in all project details below. Required fields are marked with *</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        {/* Basic Information Section */}
        <section className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                required
              >
                <option value="">Select type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
        </section>

        {/* Additional Details Section */}
        <section className="form-section">
          <h2>Additional Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Long Description</label>
              <textarea
                value={formData.long_description || ''}
                onChange={(e) => handleInputChange('long_description', e.target.value)}
                rows={6}
              />
            </div>

            <div className="form-group">
              <label>Timeline</label>
              <input
                type="text"
                value={formData.timeline || ''}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="e.g., 10 months"
              />
            </div>

            <div className="form-group">
              <label>Team</label>
              <input
                type="text"
                value={formData.team || ''}
                onChange={(e) => handleInputChange('team', e.target.value)}
                placeholder="e.g., 6 developers, 2 data scientists"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g., Lead Developer"
              />
            </div>

            <div className="form-group">
              <label>Budget</label>
              <input
                type="text"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="e.g., $3.0M"
              />
            </div>

            <div className="form-group">
              <label>Client</label>
              <input
                type="text"
                value={formData.client || ''}
                onChange={(e) => handleInputChange('client', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Cover Image URL</label>
              <input
                type="url"
                value={formData.cover_image_url || ''}
                onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Highlight</label>
              <input
                type="text"
                value={formData.highlight || ''}
                onChange={(e) => handleInputChange('highlight', e.target.value)}
                placeholder="e.g., Primary Focus"
              />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="form-section">
          <h2>Links</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Live URL</label>
              <input
                type="url"
                value={formData.links.live || ''}
                onChange={(e) => handleLinksChange('live', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>GitHub URL</label>
              <input
                type="url"
                value={formData.links.github || ''}
                onChange={(e) => handleLinksChange('github', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Documentation URL</label>
              <input
                type="url"
                value={formData.links.documentation || ''}
                onChange={(e) => handleLinksChange('documentation', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Case Study URL</label>
              <input
                type="url"
                value={formData.links.case_study || ''}
                onChange={(e) => handleLinksChange('case_study', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Demo URL</label>
              <input
                type="url"
                value={formData.links.demo || ''}
                onChange={(e) => handleLinksChange('demo', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="form-section">
          <h2>Technologies</h2>
          <button
            type="button"
            onClick={() => addArrayItem('technologies', { skill_id: 0, level: '' })}
            className="btn-add"
          >
            + Add Technology
          </button>
          {formData.technologies.map((tech, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>Skill *</label>
                <select
                  value={tech.skill_id}
                  onChange={(e) => updateArrayItem('technologies', index, 'skill_id', parseInt(e.target.value))}
                  required
                >
                  <option value={0}>Select skill</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Level</label>
                <input
                  type="text"
                  value={tech.level || ''}
                  onChange={(e) => updateArrayItem('technologies', index, 'level', e.target.value)}
                  placeholder="e.g., 90, Advanced, Master"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('technologies', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Images Section */}
        <section className="form-section">
          <h2>Images</h2>
          <button
            type="button"
            onClick={() => addArrayItem('images', { url: '', caption: '', type: 'screenshot', order: formData.images.length })}
            className="btn-add"
          >
            + Add Image
          </button>
          {formData.images.map((img, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => updateArrayItem('images', index, 'url', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Caption *</label>
                <input
                  type="text"
                  value={img.caption}
                  onChange={(e) => updateArrayItem('images', index, 'caption', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={img.type}
                  onChange={(e) => updateArrayItem('images', index, 'type', e.target.value)}
                  required
                >
                  {imageTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={img.order}
                  onChange={(e) => updateArrayItem('images', index, 'order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('images', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="form-section">
          <h2>Features</h2>
          <button
            type="button"
            onClick={() => addArrayItem('features', { title: '', description: '', status: 'completed', order: formData.features.length })}
            className="btn-add"
          >
            + Add Feature
          </button>
          {formData.features.map((feature, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={feature.description}
                  onChange={(e) => updateArrayItem('features', index, 'description', e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Icon Key</label>
                <input
                  type="text"
                  value={feature.icon_key || ''}
                  onChange={(e) => updateArrayItem('features', index, 'icon_key', e.target.value)}
                  placeholder="e.g., activity, users"
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={feature.status}
                  onChange={(e) => updateArrayItem('features', index, 'status', e.target.value)}
                  required
                >
                  {featureStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Impact</label>
                <input
                  type="text"
                  value={feature.impact || ''}
                  onChange={(e) => updateArrayItem('features', index, 'impact', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={feature.order}
                  onChange={(e) => updateArrayItem('features', index, 'order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('features', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Roadmap Section */}
        <section className="form-section">
          <h2>Roadmap Phases</h2>
          <button
            type="button"
            onClick={() => addArrayItem('roadmap', {
              phase: '',
              description: '',
              duration: '',
              status: 'not started',
              deliverables: [],
              challenges: [],
              solutions: [],
              order: formData.roadmap.length
            })}
            className="btn-add"
          >
            + Add Phase
          </button>
          {formData.roadmap.map((phase, index) => (
            <div key={index} className="array-item phase-item">
              <div className="form-group">
                <label>Phase Name *</label>
                <input
                  type="text"
                  value={phase.phase}
                  onChange={(e) => updateArrayItem('roadmap', index, 'phase', e.target.value)}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={phase.description}
                  onChange={(e) => updateArrayItem('roadmap', index, 'description', e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration *</label>
                <input
                  type="text"
                  value={phase.duration}
                  onChange={(e) => updateArrayItem('roadmap', index, 'duration', e.target.value)}
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={phase.status}
                  onChange={(e) => updateArrayItem('roadmap', index, 'status', e.target.value)}
                  required
                >
                  {phaseStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Deliverables (one per line)</label>
                <textarea
                  value={phase.deliverables.join('\n')}
                  onChange={(e) => updateArrayItem('roadmap', index, 'deliverables', e.target.value.split('\n').filter(l => l.trim()))}
                  rows={3}
                  placeholder="Enter each deliverable on a new line"
                />
              </div>
              <div className="form-group full-width">
                <label>Challenges (one per line)</label>
                <textarea
                  value={phase.challenges.join('\n')}
                  onChange={(e) => updateArrayItem('roadmap', index, 'challenges', e.target.value.split('\n').filter(l => l.trim()))}
                  rows={3}
                  placeholder="Enter each challenge on a new line"
                />
              </div>
              <div className="form-group full-width">
                <label>Solutions (one per line)</label>
                <textarea
                  value={phase.solutions.join('\n')}
                  onChange={(e) => updateArrayItem('roadmap', index, 'solutions', e.target.value.split('\n').filter(l => l.trim()))}
                  rows={3}
                  placeholder="Enter each solution on a new line"
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={phase.order}
                  onChange={(e) => updateArrayItem('roadmap', index, 'order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('roadmap', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="form-section">
          <h2>Stats</h2>
          <button
            type="button"
            onClick={() => addArrayItem('stats', { key: '', value: '', is_list_stat: false, order: formData.stats.length })}
            className="btn-add"
          >
            + Add Stat
          </button>
          {formData.stats.map((stat, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>Key *</label>
                <input
                  type="text"
                  value={stat.key}
                  onChange={(e) => updateArrayItem('stats', index, 'key', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Value *</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={stat.is_list_stat}
                    onChange={(e) => updateArrayItem('stats', index, 'is_list_stat', e.target.checked)}
                  />
                  Is List Stat
                </label>
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={stat.order}
                  onChange={(e) => updateArrayItem('stats', index, 'order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('stats', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Metrics Section */}
        <section className="form-section">
          <h2>Metrics</h2>
          <button
            type="button"
            onClick={() => addArrayItem('metrics', { key: '', value: '', order: formData.metrics.length })}
            className="btn-add"
          >
            + Add Metric
          </button>
          {formData.metrics.map((metric, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>Key *</label>
                <input
                  type="text"
                  value={metric.key}
                  onChange={(e) => updateArrayItem('metrics', index, 'key', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Value *</label>
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => updateArrayItem('metrics', index, 'value', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={metric.order}
                  onChange={(e) => updateArrayItem('metrics', index, 'order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('metrics', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Testimonials Section */}
        <section className="form-section">
          <h2>Testimonials</h2>
          <button
            type="button"
            onClick={() => addArrayItem('testimonials', { name: '', role: '', company: '', quote: '', rating: 5, order: formData.testimonials.length })}
            className="btn-add"
          >
            + Add Testimonial
          </button>
          {formData.testimonials.map((testimonial, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => updateArrayItem('testimonials', index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <input
                  type="text"
                  value={testimonial.role}
                  onChange={(e) => updateArrayItem('testimonials', index, 'role', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={testimonial.company}
                  onChange={(e) => updateArrayItem('testimonials', index, 'company', e.target.value)}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Quote *</label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => updateArrayItem('testimonials', index, 'quote', e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating * (1-5)</label>
                <input
                  type="number"
                  value={testimonial.rating}
                  onChange={(e) => updateArrayItem('testimonials', index, 'rating', Math.max(1, Math.min(5, parseInt(e.target.value) || 5)))}
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={testimonial.order}
                  onChange={(e) => updateArrayItem('testimonials', index, 'order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('testimonials', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section className="form-section">
          <h2>Skills (Project Contributions)</h2>
          <button
            type="button"
            onClick={() => addArrayItem('skills', { skill_id: 0, contribution: '', complexity: '' })}
            className="btn-add"
          >
            + Add Skill
          </button>
          {formData.skills.map((skill, index) => (
            <div key={index} className="array-item">
              <div className="form-group">
                <label>Skill *</label>
                <select
                  value={skill.skill_id}
                  onChange={(e) => updateArrayItem('skills', index, 'skill_id', parseInt(e.target.value))}
                  required
                >
                  <option value={0}>Select skill</option>
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Contribution</label>
                <input
                  type="text"
                  value={skill.contribution || ''}
                  onChange={(e) => updateArrayItem('skills', index, 'contribution', e.target.value)}
                  placeholder="How this skill contributed"
                />
              </div>
              <div className="form-group">
                <label>Complexity</label>
                <input
                  type="text"
                  value={skill.complexity || ''}
                  onChange={(e) => updateArrayItem('skills', index, 'complexity', e.target.value)}
                  placeholder="e.g., high, medium, low"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('skills', index)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectsPage;

