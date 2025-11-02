import React from 'react';

interface FeaturesSectionProps {
  features: Array<{
    title: string;
    description: string;
    icon_key?: string;
    status: string;
    impact?: string;
    order: number;
  }>;
  featureStatuses: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  featureStatuses,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <section className="form-section">
      <h2>Features</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Feature
      </button>
      {features.map((feature, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={feature.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              value={feature.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Icon Key</label>
            <input
              type="text"
              value={feature.icon_key || ''}
              onChange={(e) => onUpdate(index, 'icon_key', e.target.value)}
              placeholder="e.g., activity, users"
            />
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              value={feature.status}
              onChange={(e) => onUpdate(index, 'status', e.target.value)}
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
              onChange={(e) => onUpdate(index, 'impact', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={feature.order}
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

export default FeaturesSection;



