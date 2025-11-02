import React from 'react';

interface StatsSectionProps {
  stats: Array<{ key: string; value: string; is_list_stat: boolean; order: number }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <section className="form-section">
      <h2>Stats</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Stat
      </button>
      {stats.map((stat, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Key *</label>
            <input
              type="text"
              value={stat.key}
              onChange={(e) => onUpdate(index, 'key', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Value *</label>
            <input
              type="text"
              value={stat.value}
              onChange={(e) => onUpdate(index, 'value', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={stat.is_list_stat}
                onChange={(e) => onUpdate(index, 'is_list_stat', e.target.checked)}
              />
              Is List Stat
            </label>
          </div>
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={stat.order}
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

export default StatsSection;



