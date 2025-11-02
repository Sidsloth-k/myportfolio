import React from 'react';
import UrlOrUploadField from './UrlOrUploadField';

interface AdditionalDetailsSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <section className="form-section">
      <h2>Additional Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={formData.subtitle || ''}
            onChange={(e) => onInputChange('subtitle', e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label>Long Description</label>
          <textarea
            value={formData.long_description || ''}
            onChange={(e) => onInputChange('long_description', e.target.value)}
            rows={6}
          />
        </div>

        <div className="form-group">
          <label>Timeline</label>
          <input
            type="text"
            value={formData.timeline || ''}
            onChange={(e) => onInputChange('timeline', e.target.value)}
            placeholder="e.g., 10 months"
          />
        </div>

        <div className="form-group">
          <label>Team</label>
          <input
            type="text"
            value={formData.team || ''}
            onChange={(e) => onInputChange('team', e.target.value)}
            placeholder="e.g., 6 developers, 2 data scientists"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => onInputChange('role', e.target.value)}
            placeholder="e.g., Lead Developer"
          />
        </div>

        <div className="form-group">
          <label>Budget</label>
          <input
            type="text"
            value={formData.budget || ''}
            onChange={(e) => onInputChange('budget', e.target.value)}
            placeholder="e.g., $3.0M"
          />
        </div>

        <div className="form-group">
          <label>Client</label>
          <input
            type="text"
            value={formData.client || ''}
            onChange={(e) => onInputChange('client', e.target.value)}
          />
        </div>

        {null}

        {null}
      </div>
    </section>
  );
};

export default AdditionalDetailsSection;

