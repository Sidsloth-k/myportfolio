import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { validateProjectForm } from '../../utils/validators';
import { decryptId } from '../../utils/encryption';
import { useProjectForm } from './hooks/useProjectForm';
import { useLocalTypes } from './hooks/useLocalTypes';
import { useLocalCategories } from './hooks/useLocalCategories';
import BasicInfoSection from './components/BasicInfoSection';
import AdditionalDetailsSection from './components/AdditionalDetailsSection';
import LinksSection from './components/LinksSection';
import UnifiedSkillsSection from './components/UnifiedSkillsSection';
import ImagesSection from './components/ImagesSection';
import FeaturesSection from './components/FeaturesSection';
import RoadmapSection from './components/RoadmapSection';
import StatsSection from './components/StatsSection';
import MetricsSection from './components/MetricsSection';
import TestimonialsSection from './components/TestimonialsSection';
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

const ProjectEditPage: React.FC = () => {
  const { encryptedId, id } = useParams<{ encryptedId?: string; id?: string }>();
  const urlId = encryptedId || id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const { projectTypes, imageTypes, addProjectType, addImageType, mergeServerProjectTypes, isRefetchingTypes, refetchProjectTypes } = useLocalTypes();
  const { categories: localCategories, addCategory, mergeServerCategories, asOptions } = useLocalCategories();
  
  const {
    formData,
    handleInputChange,
    handleLinksChange,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    loadFormData
  } = useProjectForm();

  const featureStatuses = ['completed', 'in progress', 'planned'];
  const phaseStatuses = ['completed', 'in progress', 'not started'];

  useEffect(() => {
    if (urlId) {
      loadProjectData();
    }
  }, [urlId]);

  const loadProjectData = async () => {
    if (!urlId) return;
    
    // Decrypt the ID from URL
    let projectId: number | null = null;
    try {
      projectId = decryptId(urlId);
    } catch (error) {
      console.error('Decryption error:', error);
      // If decryption fails, try parsing as number for backward compatibility
      projectId = parseInt(urlId, 10);
      if (isNaN(projectId)) {
        setError(`Invalid project ID: ${urlId}. Please check the URL.`);
        setLoading(false);
        return;
      }
    }
    
    if (projectId === null) {
      // Fallback: try parsing as number for backward compatibility
      projectId = parseInt(urlId, 10);
      if (isNaN(projectId)) {
        setError(`Invalid project ID: ${urlId}. Could not decrypt or parse as number.`);
        setLoading(false);
        return;
      }
    }
    
    setLoading(true);
    try {
      const [projectRes, skillsRes, categoriesRes, typesRes] = await Promise.all([
        apiService.getProject(projectId),
        apiService.getSkills(),
        apiService.getProjectCategories(),
        apiService.getProjectTypes()
      ]);

      if (projectRes.success && projectRes.data) {
        const project = projectRes.data;
        
        // Map technologies from backend format (id) to frontend format (skill_id)
        // Filter out invalid entries
        const mappedTechnologies = (project.technologies || [])
          .filter((tech: any) => tech.id || tech.skill_id)
          .map((tech: any) => ({
            skill_id: parseInt(tech.id || tech.skill_id) || 0,
            level: tech.level || ''
          }));
        
        // Map skills from backend format to frontend format
        // Filter out invalid entries
        const mappedSkills = (project.skills || [])
          .filter((skill: any) => skill.id || skill.skill_id)
          .map((skill: any) => ({
            skill_id: parseInt(skill.id || skill.skill_id) || 0,
            contribution: skill.contribution || '',
            complexity: skill.complexity || ''
          }));
        
        loadFormData({
          title: project.title || '',
          category: project.category || '',
          type: project.type || '',
          description: project.description || '',
          subtitle: project.subtitle,
          long_description: project.long_description,
          timeline: project.timeline,
          team: project.team,
          role: project.role,
          budget: project.budget,
          client: project.client,
          cover_image_url: project.cover_image_url,
          highlight: project.highlight,
          highlight_background_color: project.highlight_background_color,
          links: project.links || {},
          technologies: mappedTechnologies,
          images: project.images || [],
          features: project.features || [],
          roadmap: project.roadmap || [],
          stats: project.stats || [],
          metrics: project.metrics || [],
          testimonials: project.testimonials || [],
          skills: mappedSkills
        });
      }

      if (skillsRes.success && skillsRes.data) {
        const allSkills: Skill[] = [];
        skillsRes.data.forEach((category: any) => {
          if (category.skills && Array.isArray(category.skills)) {
            allSkills.push(...category.skills);
          }
        });
        const uniqMap = new Map<number, Skill>();
        allSkills.forEach((s: any) => {
          const idNum = Number(s.id);
          if (!uniqMap.has(idNum)) uniqMap.set(idNum, { ...s, id: idNum } as Skill);
        });
        setSkills(Array.from(uniqMap.values()));
      }

      if (categoriesRes.success && categoriesRes.data) {
        mergeServerCategories(categoriesRes.data);
      }

      if (typesRes.success && typesRes.data) {
        // Backend returns array of objects with { id, name, count }
        mergeServerProjectTypes(typesRes.data);
      }
    } catch (err: any) {
      setError('Failed to load project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const [creatingCategory, setCreatingCategory] = useState(false);
  
  const handleCreateCategory = async (name: string) => {
    setCreatingCategory(true);
    try {
      // Optimistically add to dropdown for immediate availability
      addCategory(name);
      // Immediately set the newly created category as selected
      handleInputChange('category', name);

      const response = await apiService.createProjectCategory(name);
      if (response.success) {
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
    try {
      // Optimistically add to dropdown for immediate availability
      // Note: We can't optimistically add to projectTypes since they come from DB
      // But we can immediately set the newly created type as selected
      handleInputChange('type', name);

      const response = await apiService.createProjectType(name);
      if (response.success) {
        // Refetch types from database to get the updated list
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
    }
  };

  const handleCreateImageType = (type: string) => {
    addImageType(type);
    setSuccess('Image type added');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlId) return;

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
      
      // Get project ID (decrypt if needed)
      let projectId: number | null = urlId ? decryptId(urlId) : null;
      if (projectId === null && urlId) {
        projectId = parseInt(urlId, 10);
      }
      if (!projectId) {
        setError('Invalid project ID');
        return;
      }
      const response = await apiService.updateProject(projectId, cleanedData);
      if (response.success) {
        setSuccess('Project updated successfully!');
        setTimeout(() => {
          navigate('/dashboard/projects');
        }, 1500);
      } else {
        const errorMsg = response.error || 'Failed to update project';
        setError(errorMsg);
        console.error('Update error:', response);
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
      console.error('Update error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const savePartial = async (partial: any, successMsg: string) => {
    if (!urlId) return;
    setError(null);
    setSuccess(null);
    try {
      // Get project ID (decrypt if needed)
      let projectId: number | null = null;
      try {
        projectId = decryptId(urlId);
      } catch (error) {
        console.error('Decryption error in savePartial:', error);
        // If decryption fails, try parsing as number for backward compatibility
        projectId = parseInt(urlId, 10);
      }
      
      if (projectId === null || isNaN(projectId)) {
        projectId = parseInt(urlId, 10);
        if (isNaN(projectId)) {
          setError(`Invalid project ID: ${urlId}. Could not decrypt or parse as number.`);
          return;
        }
      }
      
      const res = await apiService.patchProject(projectId, partial);
      if (res.success) {
        setSuccess(successMsg);
      } else {
        setError(res.error || 'Failed to save changes');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
      console.error('Save partial error:', err);
    }
  };

  if (loading) {
    return (
      <div className="projects-page loading">
        <div className="spinner"></div>
        <p>Loading project...</p>
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
          <h1>Edit Project</h1>
          <p>Update project details below. Required fields are marked with *</p>
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
          onRefetchTypes={refetchProjectTypes}
          creatingType={isRefetchingTypes}
          isRefetchingTypes={isRefetchingTypes}
          creatingCategory={creatingCategory}
          onToast={(type, msg) => type === 'success' ? setSuccess(msg) : setError(msg)}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            title: formData.title,
            category: formData.category,
            type: formData.type,
            description: formData.description,
            cover_image_url: formData.cover_image_url,
            highlight: formData.highlight,
            highlight_background_color: formData.highlight_background_color
          }, 'Basic information saved')}>Save Basic Info</button>
        </div>

        <AdditionalDetailsSection
          formData={formData}
          onInputChange={handleInputChange}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            subtitle: formData.subtitle,
            long_description: formData.long_description,
            timeline: formData.timeline,
            team: formData.team,
            role: formData.role,
            budget: formData.budget,
            client: formData.client,
            cover_image_url: formData.cover_image_url,
            highlight: formData.highlight,
            highlight_background_color: formData.highlight_background_color
          }, 'Additional details saved')}>Save Additional Details</button>
        </div>

        <LinksSection
          links={formData.links}
          onLinksChange={handleLinksChange}
          errors={validationErrors}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            links: formData.links
          }, 'Links saved')}>Save Links</button>
        </div>

        <UnifiedSkillsSection
          technologies={formData.technologies}
          skills={formData.skills}
          availableSkills={skills}
          onTechnologiesChange={(techs) => {
            handleInputChange('technologies', techs);
          }}
          onSkillsChange={(sk) => {
            handleInputChange('skills', sk);
          }}
          onAppendAvailableSkill={(s) => setSkills(prev => [s, ...prev.filter(p => p.id !== s.id)])}
          onSave={async () => {
            await savePartial({
              technologies: (formData.technologies || []).filter((t: any) => t.skill_id && parseInt(t.skill_id) > 0),
              skills: (formData.skills || []).filter((s: any) => s.skill_id && parseInt(s.skill_id) > 0)
            }, 'Technologies and skills saved');
            try {
              const skillsRes = await apiService.getSkills();
              if (skillsRes.success && skillsRes.data) {
                const allSkills: Skill[] = [];
                skillsRes.data.forEach((category: any) => {
                  if (category.skills && Array.isArray(category.skills)) {
                    allSkills.push(...category.skills);
                  }
                });
                const uniqMap = new Map<number, Skill>();
                allSkills.forEach((s: any) => {
                  const idNum = Number(s.id);
                  if (!uniqMap.has(idNum)) uniqMap.set(idNum, { ...s, id: idNum } as Skill);
                });
                setSkills(Array.from(uniqMap.values()));
              }
            } catch {}
          }}
          onToast={(type, msg) => type === 'success' ? setSuccess(msg) : setError(msg)}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            technologies: (formData.technologies || []).filter((t: any) => t.skill_id && parseInt(t.skill_id) > 0),
            skills: (formData.skills || []).filter((s: any) => s.skill_id && parseInt(s.skill_id) > 0)
          }, 'Technologies and skills saved')}>Save Technologies & Skills</button>
        </div>

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
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            images: (formData.images || []).filter((img: any) => img.url && img.caption && img.type).map((img: any) => ({
              url: img.url,
              alt_text: img.alt_text || null,
              caption: img.caption,
              type: img.type,
              order: img.order || 0
            }))
          }, 'Images saved')}>Save Images</button>
        </div>

        <FeaturesSection
          features={formData.features}
          featureStatuses={featureStatuses}
          onAdd={() => addArrayItem('features', { title: '', description: '', status: 'completed', order: formData.features.length })}
          onRemove={(index) => removeArrayItem('features', index)}
          onUpdate={(index, field, value) => updateArrayItem('features', index, field, value)}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            features: (formData.features || []).filter((f: any) => f.title && f.description && f.status)
          }, 'Features saved')}>Save Features</button>
        </div>

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
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            roadmap: (formData.roadmap || []).filter((p: any) => p.phase && p.description && p.duration && p.status)
          }, 'Roadmap saved')}>Save Roadmap</button>
        </div>

        <StatsSection
          stats={formData.stats}
          onAdd={() => addArrayItem('stats', { key: '', value: '', is_list_stat: false, order: formData.stats.length })}
          onRemove={(index) => removeArrayItem('stats', index)}
          onUpdate={(index, field, value) => updateArrayItem('stats', index, field, value)}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            stats: (formData.stats || []).filter((s: any) => s.key && s.value)
          }, 'Stats saved')}>Save Stats</button>
        </div>

        <MetricsSection
          metrics={formData.metrics}
          onAdd={() => addArrayItem('metrics', { key: '', value: '', order: formData.metrics.length })}
          onRemove={(index) => removeArrayItem('metrics', index)}
          onUpdate={(index, field, value) => updateArrayItem('metrics', index, field, value)}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            metrics: (formData.metrics || []).filter((m: any) => m.key && m.value)
          }, 'Metrics saved')}>Save Metrics</button>
        </div>

        <TestimonialsSection
          testimonials={formData.testimonials}
          onAdd={() => addArrayItem('testimonials', { name: '', role: '', company: '', quote: '', rating: 5, order: formData.testimonials.length })}
          onRemove={(index) => removeArrayItem('testimonials', index)}
          onUpdate={(index, field, value) => updateArrayItem('testimonials', index, field, value)}
          errors={validationErrors}
        />
        <div className="form-actions" style={{justifyContent: 'flex-end'}}>
          <button type="button" className="btn-submit" onClick={() => savePartial({
            testimonials: (formData.testimonials || []).filter((t: any) => t.name && t.role && t.company && t.quote && t.rating >= 1 && t.rating <= 5)
          }, 'Testimonials saved')}>Save Testimonials</button>
        </div>

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
            {submitting ? 'Updating...' : 'Update Project'}
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

export default ProjectEditPage;

