import React, { useState } from 'react';
import apiService from '../../../services/api';

interface Skill {
  id: number;
  name: string;
  category: string;
}

interface SkillsSectionProps {
  skills: Array<{ skill_id: number; contribution?: string; complexity?: string }>;
  availableSkills: Skill[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  onAppendAvailableSkill?: (skill: Skill) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  availableSkills,
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
    try {
      const res = await apiService.createSkill({
        name,
        category: category || undefined,
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
      <h2>Skills (Project Contributions)</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Skill
      </button>
      {skills.map((skill, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Skill *</label>
            <select
              value={skill.skill_id}
              onChange={(e) => onUpdate(index, 'skill_id', parseInt(e.target.value))}
              required
            >
              <option value={0}>Select skill</option>
              {availableSkills.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
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
            <label>Contribution</label>
            <input
              type="text"
              value={skill.contribution || ''}
              onChange={(e) => onUpdate(index, 'contribution', e.target.value)}
              placeholder="How this skill contributed"
            />
          </div>
          <div className="form-group">
            <label>Complexity</label>
            <input
              type="text"
              value={skill.complexity || ''}
              onChange={(e) => onUpdate(index, 'complexity', e.target.value)}
              placeholder="e.g., high, medium, low"
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

export default SkillsSection;


