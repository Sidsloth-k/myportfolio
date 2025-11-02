import React, { useState, useEffect } from 'react';
import { ContactInfo } from './ContactInfoRow';
import { ContactType } from '../../atoms/contact/ContactTypeBadge';
import './ContactInfoForm.css';

interface ContactInfoFormProps {
  contactInfo?: ContactInfo | null;
  onSave: (data: Partial<ContactInfo>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  contactInfo,
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    key: '',
    label: '',
    value: '',
    contact_values: [],
    description: '',
    icon_key: '',
    display_order: 0,
    contact_type: 'email',
    is_active: true
  });

  const [contactValuesInput, setContactValuesInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        ...contactInfo,
        contact_values: contactInfo.contact_values || []
      });
      setContactValuesInput((contactInfo.contact_values || []).join('\n'));
    } else {
      setFormData({
        key: '',
        label: '',
        value: '',
        contact_values: [],
        description: '',
        icon_key: '',
        display_order: 0,
        contact_type: 'email',
        is_active: true
      });
      setContactValuesInput('');
    }
    setErrors({});
  }, [contactInfo]);

  const handleInputChange = (field: keyof ContactInfo, value: any) => {
    setFormData((prev: Partial<ContactInfo>) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field as string]: '' }));
    }
  };

  const handleContactValuesChange = (value: string) => {
    setContactValuesInput(value);
    const values = value.split('\n').filter(v => v.trim());
    setFormData((prev: Partial<ContactInfo>) => ({ ...prev, contact_values: values }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.key?.trim()) {
      newErrors.key = 'Key is required';
    } else if (!/^[a-z0-9_]+$/.test(formData.key)) {
      newErrors.key = 'Key must be lowercase letters, numbers, and underscores only';
    }

    if (!formData.label?.trim()) {
      newErrors.label = 'Label is required';
    }

    if (!formData.value?.trim()) {
      newErrors.value = 'Value is required';
    }

    if (formData.display_order === undefined || formData.display_order < 0) {
      newErrors.display_order = 'Display order must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave(formData);
  };

  const contactTypes: ContactType[] = ['email', 'phone', 'whatsapp', 'location'];

  return (
    <form className="contact-info-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>
            Key {!contactInfo && <span className="required">*</span>}
          </label>
          <input
            type="text"
            value={formData.key || ''}
            onChange={(e) => handleInputChange('key', e.target.value)}
            disabled={!!contactInfo || isSubmitting}
            className={errors.key ? 'error' : ''}
            placeholder="e.g., detective_email"
          />
          {errors.key && <span className="error-text">{errors.key}</span>}
        </div>

        <div className="form-group">
          <label>
            Label <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            disabled={isSubmitting}
            className={errors.label ? 'error' : ''}
            placeholder="e.g., Detective Email"
          />
          {errors.label && <span className="error-text">{errors.label}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Value <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.value || ''}
            onChange={(e) => handleInputChange('value', e.target.value)}
            disabled={isSubmitting}
            className={errors.value ? 'error' : ''}
            placeholder="e.g., sidney@detective-agency.dev"
          />
          {errors.value && <span className="error-text">{errors.value}</span>}
        </div>

        <div className="form-group">
          <label>Contact Type</label>
          <select
            value={formData.contact_type || 'email'}
            onChange={(e) => handleInputChange('contact_type', e.target.value as ContactType)}
            disabled={isSubmitting}
          >
            {contactTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label>Additional Values (one per line)</label>
        <textarea
          value={contactValuesInput}
          onChange={(e) => handleContactValuesChange(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          placeholder="e.g.,&#10;contact@detective-agency.dev&#10;support@detective-agency.dev"
        />
        <span className="form-hint">
          Enter multiple contact values, one per line
        </span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Primary communication channel"
          />
        </div>

        <div className="form-group">
          <label>Icon Key</label>
          <input
            type="text"
            value={formData.icon_key || ''}
            onChange={(e) => handleInputChange('icon_key', e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., mail, phone, map-pin"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Display Order <span className="required">*</span>
          </label>
          <input
            type="number"
            value={formData.display_order || 0}
            onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
            disabled={isSubmitting}
            min="0"
            className={errors.display_order ? 'error' : ''}
          />
          {errors.display_order && (
            <span className="error-text">{errors.display_order}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.is_active !== false}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              disabled={isSubmitting}
            />
            <span style={{ marginLeft: '8px' }}>Active</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-save"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : contactInfo ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

