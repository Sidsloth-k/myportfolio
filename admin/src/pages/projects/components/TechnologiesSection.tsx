import React, { useState } from 'react';
import apiService from '../../../services/api';

interface Skill {
  id: number;
  name: string;
  category: string;
}

interface TechnologiesSectionProps {
  technologies: Array<{ skill_id: number; level?: string }>;
  skills: Skill[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  onAppendAvailableSkill?: (skill: Skill) => void;
}

const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({
  technologies,
  skills,
  onAdd,
  onRemove,
  onUpdate,
  onAppendAvailableSkill
}) => {
  const [newNames, setNewNames] = useState<Record<number, string>>({});
  const [newCategories, setNewCategories] = useState<Record<number, string>>({});

  const createSkillForRow = async (index: number) => {
    const name = (newNames[index] || '').trim();
    if (!name) return;
    const category = (newCategories[index] || '').trim();
    const level = technologies[index]?.level;
    try {
      const res = await apiService.createSkill({
        name,
        category: category || undefined,
        proficiency_level: level || undefined,
      });
      if (res.success && res.data) {
        const created = res.data as any as Skill;
        onAppendAvailableSkill?.(created);
        onUpdate(index, 'skill_id', created.id);
        setNewNames(prev => ({ ...prev, [index]: '' }));
        setNewCategories(prev => ({ ...prev, [index]: '' }));
      }
    } catch (e) {
      // swallow; parent toast handles general errors
    }
  };
  return (
    <section className="form-section">
      <h2>Technologies</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Technology
      </button>
      {technologies.map((tech, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Skill *</label>
            <select
              value={tech.skill_id}
              onChange={(e) => onUpdate(index, 'skill_id', parseInt(e.target.value))}
              required
            >
              <option value={0}>Select skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Or create new</label>
            <div className="inline-input-group">
              <input
                type="text"
                placeholder="New skill name"
                value={newNames[index] || ''}
                onChange={(e) => setNewNames(prev => ({ ...prev, [index]: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Category (optional)"
                value={newCategories[index] || ''}
                onChange={(e) => setNewCategories(prev => ({ ...prev, [index]: e.target.value }))}
              />
              <button type="button" className="btn-add-small" onClick={() => createSkillForRow(index)}>
                Create & Select
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Level</label>
            <input
              type="text"
              value={tech.level || ''}
              onChange={(e) => onUpdate(index, 'level', e.target.value)}
              placeholder="e.g., 90, Advanced, Master"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="btn-remove"
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
};

export default TechnologiesSection;


