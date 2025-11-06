import React, { useState } from 'react';
import UrlOrUploadField from './UrlOrUploadField';
import HighlightColorPicker from './HighlightColorPicker';

interface BasicInfoSectionProps {
  formData: any;
  categories: any[];
  projectTypes: string[];
  onInputChange: (field: string, value: any) => void;
  onCreateCategory: (name: string) => Promise<void>;
  onCreateType: (name: string) => Promise<void> | void;
  onRefetchTypes?: () => Promise<void>;
  creatingCategory?: boolean;
  creatingType?: boolean;
  isRefetchingTypes?: boolean;
  onToast?: (type: 'success' | 'error', message: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  categories,
  projectTypes,
  onInputChange,
  onCreateCategory,
  onCreateType,
  onRefetchTypes,
  creatingCategory = false,
  creatingType = false,
  isRefetchingTypes = false,
  onToast
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('');

  const handleAddCategory = async () => {
    if (newCategory.trim() && !creatingCategory) {
      await onCreateCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddType = async () => {
    if (newType.trim() && !creatingType) {
      try {
        await onCreateType(newType.trim());
        setNewType('');
        if (onToast) {
          onToast('success', 'Project type created successfully');
        }
      } catch (error: any) {
        if (onToast) {
          onToast('error', error.message || 'Failed to create project type');
        }
      }
    }
  };

  return (
    <section className="form-section">
      <h2>Basic Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <div className="inline-input-group">
            {(() => {
              const options = (categories || []).map((c: any) => {
                if (typeof c === 'string') return { id: c, name: c };
                return { id: c?.id ?? c?.name ?? String(Math.random()), name: c?.name ?? String(c?.id ?? '') };
              }).filter((o: any) => o.name);

              const current = (formData.category || '').toString().trim();
              if (current && !options.some((o: any) => o.name === current)) {
                options.unshift({ id: current, name: current });
              }

              return (
                <select
                  value={formData.category}
                  onChange={(e) => onInputChange('category', e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {options.map((opt: any) => (
                    <option key={opt.id} value={opt.name}>{opt.name}</option>
                  ))}
                </select>
              );
            })()}
            <div className="add-new-input">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              />
              <button 
                type="button" 
                onClick={handleAddCategory} 
                className="btn-add-small"
                disabled={creatingCategory}
              >
                {creatingCategory ? '...' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Type *</label>
          <div className="inline-input-group">
            <select
              value={formData.type}
              onChange={(e) => onInputChange('type', e.target.value)}
              required
            >
              <option value="">Select type</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {onRefetchTypes && (
              <button
                type="button"
                onClick={onRefetchTypes}
                className="btn-add-small"
                disabled={isRefetchingTypes}
                title="Reload types from database"
                style={{ marginRight: '4px' }}
              >
                {isRefetchingTypes ? '...' : '↻'}
              </button>
            )}
            <div className="add-new-input">
              <input
                type="text"
                placeholder="New type"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddType())}
              />
              <button 
                type="button" 
                onClick={handleAddType} 
                className="btn-add-small"
                disabled={creatingType}
              >
                {creatingType ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        <div className="form-group full-width">
          <UrlOrUploadField
            value={formData.cover_image_url || ''}
            onChange={(url) => onInputChange('cover_image_url', url)}
            label="Cover Image"
            placeholder="https://example.com/cover-image.jpg"
            onToast={onToast}
          />
        </div>

        {formData.cover_image_url && (
          <div className="form-group full-width">
            <label>Cover Preview</label>
            <div className="image-preview" style={{ maxWidth: '420px' }}>
              <img
                src={formData.cover_image_url}
                alt="Cover Preview"
                style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Highlight (optional)</label>
          <input
            type="text"
            value={formData.highlight || ''}
            onChange={(e) => onInputChange('highlight', e.target.value)}
            placeholder="e.g., Primary Focus"
          />
        </div>

        <div className="form-group">
          <label>Highlight Background Color (optional)</label>
          <HighlightColorPicker
            value={formData.highlight_background_color || ''}
            onChange={(color) => onInputChange('highlight_background_color', color)}
          />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
