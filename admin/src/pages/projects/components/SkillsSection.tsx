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
  const [selectedCategories, setSelectedCategories] = useState<Record<number, string>>({});
  const [creatingSkill, setCreatingSkill] = useState<Record<number, boolean>>({});

  // Extract unique categories from availableSkills
  const availableCategories = Array.from(new Set(availableSkills.map(s => s.category).filter(Boolean))).sort();

  const createSkillForRow = async (index: number) => {
    const name = (newNames[index] || '').trim();
    if (!name || creatingSkill[index]) return;
    
    setCreatingSkill(prev => ({ ...prev, [index]: true }));
    try {
      // Use selected category or new category input, default to "Others" if both empty
      const category = (selectedCategories[index] || newCategories[index] || 'Others').trim();
      const res = await apiService.createSkill({
        name,
        category: category || 'Others',
      });
      if (res.success && res.data) {
        const created = res.data as any as Skill;
        onAppendAvailableSkill?.(created);
        onUpdate(index, 'skill_id', created.id);
        setNewNames(prev => ({ ...prev, [index]: '' }));
        setNewCategories(prev => ({ ...prev, [index]: '' }));
        setSelectedCategories(prev => ({ ...prev, [index]: '' }));
      }
    } catch (e) {
      // swallow; parent toast handles general errors
    } finally {
      setCreatingSkill(prev => ({ ...prev, [index]: false }));
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
            <div className="inline-input-group">
              {(() => {
                const options = availableSkills.map(s => ({ id: s.id, name: s.name }));
                const current = skill.skill_id || 0;
                if (current > 0 && !options.some(o => o.id === current)) {
                  options.unshift({ id: current, name: 'New Skill' });
                }
                return (
                  <select
                    value={current}
                    onChange={(e) => onUpdate(index, 'skill_id', parseInt(e.target.value))}
                    required
                  >
                    <option value={0}>Select skill</option>
                    {options.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                );
              })()}
              <div className="add-new-input">
                <input
                  type="text"
                  placeholder="New skill name"
                  value={newNames[index] || ''}
                  onChange={(e) => setNewNames(prev => ({ ...prev, [index]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), createSkillForRow(index))}
                />
                <select
                  value={selectedCategories[index] || ''}
                  onChange={(e) => setSelectedCategories(prev => ({ ...prev, [index]: e.target.value }))}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">Select category</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or new category"
                  value={newCategories[index] || ''}
                  onChange={(e) => setNewCategories(prev => ({ ...prev, [index]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), createSkillForRow(index))}
                />
                <button 
                  type="button" 
                  className="btn-add-small" 
                  onClick={() => createSkillForRow(index)}
                  disabled={creatingSkill[index]}
                >
                  {creatingSkill[index] ? '...' : 'Add'}
                </button>
              </div>
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


