import React from 'react';
import { ContactInfo } from '../../molecules/contact/ContactInfoRow';
import { ContactInfoForm } from '../../molecules/contact/ContactInfoForm';
import './ContactInfoModal.css';

interface ContactInfoModalProps {
  contactInfo: ContactInfo | null;
  onClose: () => void;
  onSave: (data: Partial<ContactInfo>) => Promise<void>;
  isSubmitting?: boolean;
}

export const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  contactInfo,
  onClose,
  onSave,
  isSubmitting = false
}) => {
  const handleSave = async (data: Partial<ContactInfo>) => {
    await onSave(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{contactInfo ? 'Edit Contact Information' : 'Create Contact Information'}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>
        <div className="modal-body">
          <ContactInfoForm
            contactInfo={contactInfo}
            onSave={handleSave}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

