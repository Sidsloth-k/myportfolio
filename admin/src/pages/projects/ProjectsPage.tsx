import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { validateProjectForm } from '../../utils/validators';
import { useProjectForm } from './hooks/useProjectForm';
import { useLocalTypes } from './hooks/useLocalTypes';
import { useLocalCategories } from './hooks/useLocalCategories';
import BasicInfoSection from './components/BasicInfoSection';
import AdditionalDetailsSection from './components/AdditionalDetailsSection';
import LinksSection from './components/LinksSection';
import TechnologiesSection from './components/TechnologiesSection';
import ImagesSection from './components/ImagesSection';
import FeaturesSection from './components/FeaturesSection';
import RoadmapSection from './components/RoadmapSection';
import StatsSection from './components/StatsSection';
import MetricsSection from './components/MetricsSection';
import TestimonialsSection from './components/TestimonialsSection';
import SkillsSection from './components/SkillsSection';
import './ProjectsPage.css';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const { projectTypes, imageTypes, addProjectType, addImageType, mergeServerProjectTypes } = useLocalTypes();
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingType, setCreatingType] = useState(false);
  const { categories: localCategories, addCategory, mergeServerCategories, asOptions } = useLocalCategories();
  
  const {
    formData,
    handleInputChange,
    handleLinksChange,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    resetForm
  } = useProjectForm();

  const featureStatuses = ['completed', 'in progress', 'planned'];
  const phaseStatuses = ['completed', 'in progress', 'not started'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [skillsRes, categoriesRes, typesRes] = await Promise.all([
        apiService.getSkills(),
        apiService.getProjectCategories(),
        apiService.getProjectTypes()
      ]);

      if (skillsRes.success && skillsRes.data) {
        const allSkills: Skill[] = [];
        skillsRes.data.forEach((category: any) => {
          if (category.skills && Array.isArray(category.skills)) {
            allSkills.push(...category.skills);
          }
        });
        setSkills(allSkills);
      }

      if (categoriesRes.success && categoriesRes.data) {
        mergeServerCategories(categoriesRes.data);
      }

      if (typesRes.success && typesRes.data) {
        // Backend returns array of objects with { id, name, count }
        mergeServerProjectTypes(typesRes.data);
      }
    } catch (err: any) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (name: string) => {
    setCreatingCategory(true);
    try {
      // Optimistically add to dropdown for immediate availability
      addCategory(name);
      // Immediately set selection
      handleInputChange('category', name);

      const response = await apiService.createProjectCategory(name);
      if (response.success) {
        // Refresh categories
        const categoriesRes = await apiService.getProjectCategories();
        if (categoriesRes.success && categoriesRes.data) {
          mergeServerCategories(categoriesRes.data);
        }
        setSuccess('Category added');
      } else {
        setError('Failed to create category: ' + (response.error || 'Unknown error'));
      }
    } catch (err: any) {
      setError('Failed to create category: ' + err.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateType = async (name: string) => {
    setCreatingType(true);
    try {
      // Immediately set the newly created type as selected
      handleInputChange('type', name);

      const response = await apiService.createProjectType(name);
      if (response.success) {
        const typesRes = await apiService.getProjectTypes();
        if (typesRes.success && typesRes.data) {
          mergeServerProjectTypes(typesRes.data);
        }
        setSuccess('Project type added');
      } else {
        setError('Failed to create project type: ' + (response.error || 'Unknown error'));
      }
    } catch (err: any) {
      setError('Failed to create project type: ' + err.message);
    } finally {
      setCreatingType(false);
    }
  };

  const handleCreateImageType = (type: string) => {
    addImageType(type);
    setSuccess('Image type added');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    const validation = validateProjectForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setError('Please fix validation errors');
      return;
    }

    setSubmitting(true);
    try {
      // Filter out invalid entries before sending to backend
      const cleanedData = {
        ...formData,
        technologies: (formData.technologies || []).filter((tech: any) => tech.skill_id && parseInt(tech.skill_id) > 0),
        skills: (formData.skills || []).filter((skill: any) => skill.skill_id && parseInt(skill.skill_id) > 0),
        images: (formData.images || []).filter((img: any) => img.url && img.caption && img.type),
        features: (formData.features || []).filter((feat: any) => feat.title && feat.description && feat.status),
        roadmap: (formData.roadmap || []).filter((phase: any) => phase.phase && phase.description && phase.duration && phase.status),
        stats: (formData.stats || []).filter((stat: any) => stat.key && stat.value),
        metrics: (formData.metrics || []).filter((metric: any) => metric.key && metric.value),
        testimonials: (formData.testimonials || []).filter((tm: any) => tm.name && tm.role && tm.company && tm.quote && tm.rating >= 1 && tm.rating <= 5)
      };
      
      const response = await apiService.createProject(cleanedData);
      if (response.success) {
        setSuccess('Project created successfully!');
        resetForm();
      } else {
        setError(response.error || 'Failed to create project');
        console.error('Create error:', response);
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
      console.error('Create error:', err);
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
        <div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/projects')}
            className="btn-back"
          >
            ← Back to Projects
          </button>
          <h1>Create New Project</h1>
          <p>Fill in all project details below. Required fields are marked with *</p>
        </div>
      </div>

      {/* Inline alerts removed in favor of floating toast */}

      <form onSubmit={handleSubmit} className="project-form">
        <BasicInfoSection
          formData={formData}
          categories={asOptions() as any}
          projectTypes={projectTypes}
          onInputChange={handleInputChange}
          onCreateCategory={handleCreateCategory}
          onCreateType={handleCreateType}
          creatingCategory={creatingCategory}
          creatingType={creatingType}
          onToast={(type, msg) => type === 'success' ? setSuccess(msg) : setError(msg)}
        />

        <AdditionalDetailsSection
          formData={formData}
          onInputChange={handleInputChange}
        />

        <LinksSection
          links={formData.links}
          onLinksChange={handleLinksChange}
          errors={validationErrors}
        />

        <TechnologiesSection
          technologies={formData.technologies}
          skills={skills}
          onAdd={() => addArrayItem('technologies', { skill_id: 0, level: '' })}
          onRemove={(index) => removeArrayItem('technologies', index)}
          onUpdate={(index, field, value) => updateArrayItem('technologies', index, field, value)}
          onAppendAvailableSkill={(s) => setSkills(prev => [...prev, s])}
        />

        <ImagesSection
          images={formData.images}
          imageTypes={imageTypes}
          onAdd={() => addArrayItem('images', { url: '', alt_text: '', caption: '', type: '', order: formData.images.length })}
          onRemove={(index) => removeArrayItem('images', index)}
          onUpdate={(index, field, value) => updateArrayItem('images', index, field, value)}
          onCreateImageType={handleCreateImageType}
          errors={validationErrors}
          onToast={(type, msg) => type === 'success' ? setSuccess(msg) : setError(msg)}
        />

        <FeaturesSection
          features={formData.features}
          featureStatuses={featureStatuses}
          onAdd={() => addArrayItem('features', { title: '', description: '', status: 'completed', order: formData.features.length })}
          onRemove={(index) => removeArrayItem('features', index)}
          onUpdate={(index, field, value) => updateArrayItem('features', index, field, value)}
        />

        <RoadmapSection
          roadmap={formData.roadmap}
          phaseStatuses={phaseStatuses}
          onAdd={() => addArrayItem('roadmap', {
            phase: '',
            description: '',
            duration: '',
            status: 'not started',
            deliverables: [],
            challenges: [],
            solutions: [],
            order: formData.roadmap.length
          })}
          onRemove={(index) => removeArrayItem('roadmap', index)}
          onUpdate={(index, field, value) => updateArrayItem('roadmap', index, field, value)}
        />

        <StatsSection
          stats={formData.stats}
          onAdd={() => addArrayItem('stats', { key: '', value: '', is_list_stat: false, order: formData.stats.length })}
          onRemove={(index) => removeArrayItem('stats', index)}
          onUpdate={(index, field, value) => updateArrayItem('stats', index, field, value)}
        />

        <MetricsSection
          metrics={formData.metrics}
          onAdd={() => addArrayItem('metrics', { key: '', value: '', order: formData.metrics.length })}
          onRemove={(index) => removeArrayItem('metrics', index)}
          onUpdate={(index, field, value) => updateArrayItem('metrics', index, field, value)}
        />

        <TestimonialsSection
          testimonials={formData.testimonials}
          onAdd={() => addArrayItem('testimonials', { name: '', role: '', company: '', quote: '', rating: 5, order: formData.testimonials.length })}
          onRemove={(index) => removeArrayItem('testimonials', index)}
          onUpdate={(index, field, value) => updateArrayItem('testimonials', index, field, value)}
          errors={validationErrors}
        />

        <SkillsSection
          skills={formData.skills}
          availableSkills={skills}
          onAdd={() => addArrayItem('skills', { skill_id: 0, contribution: '', complexity: '' })}
          onRemove={(index) => removeArrayItem('skills', index)}
          onUpdate={(index, field, value) => updateArrayItem('skills', index, field, value)}
          onAppendAvailableSkill={(s) => setSkills(prev => [...prev, s])}
        />

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard/projects')}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-submit"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>

      {/* Floating toast notifications */}
      {(success || error) && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            zIndex: 9999,
            maxWidth: '360px',
          }}
        >
          {success && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                color: '#86efac',
                padding: '12px 16px',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              }}
              onClick={() => setSuccess(null)}
            >
              {success}
            </div>
          )}
          {error && (
            <div
              style={{
                background: 'rgba(220, 38, 38, 0.2)',
                border: '1px solid rgba(220, 38, 38, 0.5)',
                color: '#fca5a5',
                padding: '12px 16px',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                marginTop: '8px',
              }}
              onClick={() => setError(null)}
            >
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

