import React from 'react';
import { UrgencyBadge } from '../../atoms/contact/UrgencyBadge';
import { StatusBadge } from '../../atoms/contact/StatusBadge';
import './ContactDetailsModal.css';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  case_type?: string;
  urgency_level: 'urgent' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

interface ContactDetailsModalProps {
  contact: ContactSubmission | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: string, isRead: boolean) => void;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
  contact,
  onClose,
  onUpdateStatus
}) => {
  if (!contact) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkAsRead = () => {
    if (onUpdateStatus && !contact.is_read) {
      onUpdateStatus(contact.id, contact.status, true);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(contact.id, newStatus, contact.is_read);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="contact-detail-section">
            <div className="contact-detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{contact.name}</span>
            </div>
            <div className="contact-detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                <a href={`mailto:${contact.email}`} className="detail-link">
                  {contact.email}
                </a>
              </span>
            </div>
            {contact.subject && (
              <div className="contact-detail-row">
                <span className="detail-label">Subject:</span>
                <span className="detail-value">{contact.subject}</span>
              </div>
            )}
            <div className="contact-detail-row">
              <span className="detail-label">Case Type:</span>
              <span className="detail-value">{contact.case_type || 'Not specified'}</span>
            </div>
            <div className="contact-detail-row">
              <span className="detail-label">Urgency:</span>
              <UrgencyBadge level={contact.urgency_level} />
            </div>
            <div className="contact-detail-row">
              <span className="detail-label">Status:</span>
              <StatusBadge status={contact.status} />
            </div>
            <div className="contact-detail-row">
              <span className="detail-label">Submitted:</span>
              <span className="detail-value">{formatDate(contact.created_at)}</span>
            </div>
            {contact.updated_at && (
              <div className="contact-detail-row">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{formatDate(contact.updated_at)}</span>
              </div>
            )}
          </div>

          <div className="contact-message-section">
            <h3 className="section-title">Message</h3>
            <div className="message-content">{contact.message}</div>
          </div>

          <div className="modal-actions">
            {!contact.is_read && (
              <button
                className="btn-mark-read"
                onClick={handleMarkAsRead}
              >
                Mark as Read
              </button>
            )}
            <div className="status-actions">
              <label className="status-label">Change Status:</label>
              <select
                className="status-select"
                value={contact.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

