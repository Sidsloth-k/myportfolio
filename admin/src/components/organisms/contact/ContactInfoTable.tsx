import React from 'react';
import { ContactInfoRow, ContactInfo } from '../../molecules/contact/ContactInfoRow';
import './ContactInfoTable.css';

interface ContactInfoTableProps {
  contactInfos: ContactInfo[];
  onEdit: (contactInfo: ContactInfo) => void;
  onDelete: (key: string) => void;
  isLoading?: boolean;
}

export const ContactInfoTable: React.FC<ContactInfoTableProps> = ({
  contactInfos,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="contact-info-table-loading">
        <div className="spinner"></div>
        <p>Loading contact information...</p>
      </div>
    );
  }

  if (contactInfos.length === 0) {
    return (
      <div className="contact-info-table-empty">
        <p>No contact information found. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="contact-info-table-container">
      <table className="contact-info-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Label</th>
            <th>Value</th>
            <th>Type</th>
            <th>Status</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contactInfos.map((info) => (
            <ContactInfoRow
              key={info.key}
              contactInfo={info}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

