import React from 'react';
import { UrgencyBadge } from '../../atoms/contact/UrgencyBadge';
import { StatusBadge } from '../../atoms/contact/StatusBadge';
import { ContactSubmission } from './ContactDetailsModal';
import './ContactsTable.css';

interface ContactsTableProps {
  contacts: ContactSubmission[];
  onContactClick: (contact: ContactSubmission) => void;
  isLoading?: boolean;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onContactClick,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="contacts-table-loading">
        <div className="spinner"></div>
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="contacts-table-empty">
        <p>No contacts found</p>
      </div>
    );
  }

  return (
    <div className="contacts-table-container">
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Case Type</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Date</th>
            <th>Read</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className={`contacts-table-row ${!contact.is_read ? 'unread' : ''}`}
              onClick={() => onContactClick(contact)}
            >
              <td className="contact-name">
                <span className="name-text">{contact.name}</span>
                {!contact.is_read && <span className="unread-indicator">●</span>}
              </td>
              <td className="contact-email">{contact.email}</td>
              <td className="contact-subject" title={contact.subject || ''}>
                {truncateText(contact.subject || '', 50)}
              </td>
              <td className="contact-case-type" title={contact.case_type || ''}>
                {truncateText(contact.case_type || 'Not specified', 30)}
              </td>
              <td className="contact-urgency">
                <UrgencyBadge level={contact.urgency_level} />
              </td>
              <td className="contact-status">
                <StatusBadge status={contact.status} />
              </td>
              <td className="contact-date">{formatDate(contact.created_at)}</td>
              <td className="contact-read">
                {contact.is_read ? (
                  <span className="read-icon">✓</span>
                ) : (
                  <span className="unread-icon">●</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

