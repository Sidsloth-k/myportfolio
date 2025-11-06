import React from 'react';
import MultiLineTextarea from './MultiLineTextarea';

interface RoadmapSectionProps {
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
  phaseStatuses: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  roadmap,
  phaseStatuses,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <section className="form-section">
      <h2>Roadmap Phases</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Phase
      </button>
      {roadmap.map((phase, index) => (
        <div key={index} className="array-item phase-item">
          <div className="form-group">
            <label>Phase Name *</label>
            <input
              type="text"
              value={phase.phase}
              onChange={(e) => onUpdate(index, 'phase', e.target.value)}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              value={phase.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              value={phase.duration}
              onChange={(e) => onUpdate(index, 'duration', e.target.value)}
              placeholder="e.g., 8 weeks"
              required
            />
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              value={phase.status}
              onChange={(e) => onUpdate(index, 'status', e.target.value)}
              required
            >
              {phaseStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <MultiLineTextarea
            label="Deliverables (Enter key to add new line)"
            value={phase.deliverables}
            onChange={(value) => onUpdate(index, 'deliverables', value)}
            placeholder="Enter each deliverable on a new line (press Enter)"
            rows={3}
          />
          <MultiLineTextarea
            label="Challenges (Enter key to add new line)"
            value={phase.challenges}
            onChange={(value) => onUpdate(index, 'challenges', value)}
            placeholder="Enter each challenge on a new line (press Enter)"
            rows={3}
          />
          <MultiLineTextarea
            label="Solutions (Enter key to add new line)"
            value={phase.solutions}
            onChange={(value) => onUpdate(index, 'solutions', value)}
            placeholder="Enter each solution on a new line (press Enter)"
            rows={3}
          />
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={phase.order}
              onChange={(e) => onUpdate(index, 'order', parseInt(e.target.value) || 0)}
              min="0"
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

export default RoadmapSection;




