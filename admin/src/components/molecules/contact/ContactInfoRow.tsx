import React from 'react';
import { ContactTypeBadge, ContactType } from '../../atoms/contact/ContactTypeBadge';
import { ActiveStatusBadge } from '../../atoms/contact/ActiveStatusBadge';
import './ContactInfoRow.css';

export interface ContactInfo {
  key: string;
  label: string;
  value: string;
  contact_values?: string[];
  description?: string;
  icon_key?: string;
  display_order: number;
  contact_type?: ContactType;
  is_active?: boolean;
}

interface ContactInfoRowProps {
  contactInfo: ContactInfo;
  onEdit: (contactInfo: ContactInfo) => void;
  onDelete: (key: string) => void;
}

export const ContactInfoRow: React.FC<ContactInfoRowProps> = ({ contactInfo, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(contactInfo);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${contactInfo.label}"?`)) {
      onDelete(contactInfo.key);
    }
  };

  return (
    <tr className="contact-info-row">
      <td className="contact-info-key">{contactInfo.key}</td>
      <td className="contact-info-label">{contactInfo.label}</td>
      <td className="contact-info-value">
        {contactInfo.value}
        {contactInfo.contact_values && contactInfo.contact_values.length > 0 && (
          <span className="contact-values-count">
            +{contactInfo.contact_values.length} more
          </span>
        )}
      </td>
      <td className="contact-info-type">
        <ContactTypeBadge type={contactInfo.contact_type || 'email'} />
      </td>
      <td className="contact-info-status">
        <ActiveStatusBadge isActive={contactInfo.is_active !== false} />
      </td>
      <td className="contact-info-order">{contactInfo.display_order}</td>
      <td className="contact-info-actions">
        <button
          className="btn-edit"
          onClick={handleEdit}
          title="Edit"
        >
          <i className="bx bx-edit"></i>
        </button>
        <button
          className="btn-delete"
          onClick={handleDelete}
          title="Delete"
        >
          <i className="bx bx-trash"></i>
        </button>
      </td>
    </tr>
  );
};

