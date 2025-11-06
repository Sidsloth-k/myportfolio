import React from 'react';

interface MetricsSectionProps {
  metrics: Array<{ key: string; value: string; order: number }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  metrics,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <section className="form-section">
      <h2>Metrics</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Metric
      </button>
      {metrics.map((metric, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Key *</label>
            <input
              type="text"
              value={metric.key}
              onChange={(e) => onUpdate(index, 'key', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Value *</label>
            <input
              type="text"
              value={metric.value}
              onChange={(e) => onUpdate(index, 'value', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={metric.order}
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

export default MetricsSection;




