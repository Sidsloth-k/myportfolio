import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';

interface Skill {
  id: number;
  name: string;
  category: string;
}

interface UnifiedSkillsSectionProps {
  technologies: Array<{ skill_id: number; level?: string }>;
  skills: Array<{ skill_id: number; contribution?: string; complexity?: string }>;
  availableSkills: Skill[];
  onTechnologiesChange: (technologies: Array<{ skill_id: number; level?: string }>) => void;
  onSkillsChange: (skills: Array<{ skill_id: number; contribution?: string; complexity?: string }>) => void;
  onAppendAvailableSkill?: (skill: Skill) => void;
  onSave?: () => void;
  onToast?: (type: 'success' | 'error', message: string) => void;
}

const UnifiedSkillsSection: React.FC<UnifiedSkillsSectionProps> = ({
  technologies,
  skills,
  availableSkills,
  onTechnologiesChange,
  onSkillsChange,
  onAppendAvailableSkill,
  onSave,
  onToast
}) => {
  // Map for quick cross-referencing
  const [skillMap, setSkillMap] = useState<Map<number, { inTech: boolean; inSkills: boolean; techIndex?: number; skillIndex?: number }>>(new Map());

  useEffect(() => {
    const map = new Map();
    
    // Mark technologies
    technologies.forEach((tech, index) => {
      if (tech.skill_id) {
        const existing = map.get(tech.skill_id) || { inTech: false, inSkills: false };
        map.set(tech.skill_id, { ...existing, inTech: true, techIndex: index });
      }
    });
    
    // Mark skills
    skills.forEach((skill, index) => {
      if (skill.skill_id) {
        const existing = map.get(skill.skill_id) || { inTech: false, inSkills: false };
        map.set(skill.skill_id, { ...existing, inSkills: true, skillIndex: index });
      }
    });
    
    setSkillMap(map);
  }, [technologies, skills]);

  const handleAddSkill = () => {
    // Insert a new blank row at the TOP for better UX
    const newTech = { skill_id: 0, level: '' };
    const newSkill = { skill_id: 0, contribution: '', complexity: '' };
    onTechnologiesChange([newTech, ...technologies]);
    onSkillsChange([newSkill, ...skills]);
  };

  const handleRemoveTechnology = (index: number) => {
    const skillId = technologies[index]?.skill_id;
    const updated = technologies.filter((_, i) => i !== index);
    onTechnologiesChange(updated);
    
    // Remove from skills if it exists there with the same skill_id
    if (skillId) {
      const updatedSkills = skills.filter(s => s.skill_id !== skillId);
      onSkillsChange(updatedSkills);
    }
  };

  const handleUpdateTechnology = (index: number, field: string, value: any) => {
    const updated = [...technologies];
    updated[index] = { ...updated[index], [field]: field === 'skill_id' ? parseInt(value) || 0 : value };
    onTechnologiesChange(updated);
    
    // If skill_id is set and this skill is not in skills, optionally suggest adding it
    if (field === 'skill_id' && value && parseInt(value) > 0) {
      const skillId = parseInt(value);
      const skillIndex = skills.findIndex(s => s.skill_id === skillId);
      if (skillIndex === -1) {
        // Don't auto-add, let user manually add to skills if needed
      }
    }
  };

  const handleAddSkillsEntry = () => {
    // Keep a single entry point for adding rows (top)
    handleAddSkill();
  };

  const handleRemoveSkill = (index: number) => {
    onSkillsChange(skills.filter((_, i) => i !== index));
  };

  const handleUpdateSkill = (index: number, field: string, value: any) => {
    const techSkillId = technologies[index]?.skill_id;
    const targetIndex = techSkillId ? skills.findIndex(s => s.skill_id === techSkillId) : index;
    const resolvedIndex = targetIndex >= 0 ? targetIndex : index;
    const updated = [...skills];
    const nextSkillId = field === 'skill_id' ? (parseInt(value) || 0) : (techSkillId || 0);
    updated[resolvedIndex] = {
      skill_id: nextSkillId,
      contribution: updated[resolvedIndex]?.contribution || '',
      complexity: updated[resolvedIndex]?.complexity || '',
    } as any;
    if (field !== 'skill_id') {
      (updated[resolvedIndex] as any)[field] = value;
    }
    onSkillsChange(updated);
  };

  const [rowNewName, setRowNewName] = useState<Record<number, string>>({});

  const createSkillInline = async (index: number) => {
    const name = (rowNewName[index] || '').trim();
    if (!name) return;
    const level = technologies[index]?.level;
    try {
      const res = await apiService.createSkill({
        name,
        proficiency_level: level || undefined,
      });
      if (res.success && res.data) {
        const created = res.data as any as Skill;
        onAppendAvailableSkill?.(created);
        handleUpdateTechnology(index, 'skill_id', created.id);
        handleUpdateSkill(index, 'skill_id', created.id);
        setRowNewName(prev => ({ ...prev, [index]: '' }));
        onToast?.('success', 'Skill created');
      }
    } catch (e: any) {
      onToast?.('error', e?.message || 'Failed to create skill');
    }
  };

  return (
    <section className="form-section">
      <h2>Skills</h2>
      <p className="section-description">
        Add a Skill, and optionally include Contribution, Complexity, and Proficiency Level. New creations appear at the top.
      </p>
      <button type="button" onClick={handleAddSkill} className="btn-add">
        + Add Skill
      </button>

      {technologies.map((tech, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Skill *</label>
            {(() => {
              const selectedId = tech.skill_id || 0;
              const exists = availableSkills.some(s => Number((s as any).id) === Number(selectedId));
              const preferred = exists
                ? availableSkills.find(s => Number((s as any).id) === Number(selectedId))!
                : (selectedId > 0 ? { id: Number(selectedId), name: 'New Skill', category: '' as any } : undefined);
              const seen = new Set<string>();
              const options: Skill[] = [];
              if (preferred && !seen.has(String((preferred as any).id))) {
                seen.add(String((preferred as any).id));
                options.push({ ...(preferred as any), id: Number((preferred as any).id) } as Skill);
              }
              availableSkills.forEach((s) => {
                const sid = Number((s as any).id);
                if (!seen.has(String(sid))) {
                  seen.add(String(sid));
                  options.push({ ...(s as any), id: sid } as Skill);
                }
              });
              return (
                <select
                  value={selectedId}
                  onChange={(e) => {
                    handleUpdateTechnology(index, 'skill_id', e.target.value);
                    handleUpdateSkill(index, 'skill_id', e.target.value);
                  }}
                  required
                >
                  <option value={0}>Select skill</option>
                  {options.map((s, idx) => (
                    <option key={`opt-${String((s as any).id)}-${idx}`} value={Number((s as any).id)}>{s.name}</option>
                  ))}
                </select>
              );
            })()}
          </div>

          <div className="form-group">
            <label>Or create new</label>
            <div className="inline-input-group">
              <input
                type="text"
                placeholder="New skill name"
                value={rowNewName[index] || ''}
                onChange={(e) => setRowNewName(prev => ({ ...prev, [index]: e.target.value }))}
              />
              <button type="button" className="btn-add-small" onClick={() => createSkillInline(index)}>
                Create & Select
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Contribution (optional)</label>
            <input
              type="text"
              value={(skills.find(s => s.skill_id === tech.skill_id) || skills[index] || { contribution: '' }).contribution || ''}
              onChange={(e) => handleUpdateSkill(index, 'contribution', e.target.value)}
              placeholder="How this skill contributed to the project"
            />
          </div>

          <div className="form-group">
            <label>Complexity (optional)</label>
            <input
              type="text"
              value={(skills.find(s => s.skill_id === tech.skill_id) || skills[index] || { complexity: '' }).complexity || ''}
              onChange={(e) => handleUpdateSkill(index, 'complexity', e.target.value)}
              placeholder="e.g., High, Medium, Low"
            />
          </div>

          <div className="form-group">
            <label>Proficiency Level (optional)</label>
            <input
              type="text"
              value={tech.level || ''}
              onChange={(e) => handleUpdateTechnology(index, 'level', e.target.value)}
              placeholder="e.g., 90, Advanced, Master"
            />
          </div>

          <div className="form-actions" style={{ paddingTop: 0, borderTop: 'none', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-submit"
              onClick={async () => {
                try {
                  await onSave?.();
                  onToast?.('success', 'Skill details saved');
                } catch (e: any) {
                  onToast?.('error', e?.message || 'Failed to save');
                }
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => handleRemoveTechnology(index)}
              className="btn-remove"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UnifiedSkillsSection;

