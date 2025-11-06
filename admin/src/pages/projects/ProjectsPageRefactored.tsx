import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { validateProjectForm } from '../../utils/validators';
import { useProjectForm } from './hooks/useProjectForm';
import { useLocalTypes } from './hooks/useLocalTypes';
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { projectTypes, imageTypes, addProjectType, addImageType } = useLocalTypes();
  
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
      const [skillsRes, categoriesRes] = await Promise.all([
        apiService.getSkills(),
        apiService.getProjectCategories()
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
        setCategories(categoriesRes.data);
      }
    } catch (err: any) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const response = await apiService.createProjectCategory(name);
      if (response.success) {
        // Refresh categories
        const categoriesRes = await apiService.getProjectCategories();
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      }
    } catch (err: any) {
      setError('Failed to create category: ' + err.message);
    }
  };

  const handleCreateImageType = (type: string) => {
    addImageType(type);
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
      const response = await apiService.createProject(formData);
      if (response.success) {
        setSuccess('Project created successfully!');
        resetForm();
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
        <BasicInfoSection
          formData={formData}
          categories={categories}
          projectTypes={projectTypes}
          onInputChange={handleInputChange}
          onCreateCategory={handleCreateCategory}
          onCreateType={addProjectType}
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
        />

        <ImagesSection
          images={formData.images}
          imageTypes={imageTypes}
          onAdd={() => addArrayItem('images', { url: '', caption: '', type: '', order: formData.images.length })}
          onRemove={(index) => removeArrayItem('images', index)}
          onUpdate={(index, field, value) => updateArrayItem('images', index, field, value)}
          onCreateImageType={handleCreateImageType}
          errors={validationErrors}
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
        />

        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn-submit"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectsPage;




