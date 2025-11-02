import React, { useState, useEffect } from 'react';
import { UrgencyTabs } from '../../components/organisms/contact/UrgencyTabs';
import { StatusFilter } from '../../components/molecules/contact/StatusFilter';
import { ContactsTable } from '../../components/organisms/contact/ContactsTable';
import { ContactDetailsModal, ContactSubmission } from '../../components/organisms/contact/ContactDetailsModal';
import { apiService } from '../../services/api';
import { UrgencyLevel } from '../../components/atoms/contact/UrgencyBadge';
import { ContactStatus } from '../../components/atoms/contact/StatusBadge';
import './ContactsListPage.css';

const ContactsListPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<UrgencyLevel | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<ContactStatus | 'all'>('all');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [counts, setCounts] = useState({
    all: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const calculateCounts = (contactList: ContactSubmission[]) => {
    setCounts({
      all: contactList.length,
      urgent: contactList.filter(c => c.urgency_level === 'urgent').length,
      high: contactList.filter(c => c.urgency_level === 'high').length,
      medium: contactList.filter(c => c.urgency_level === 'medium').length,
      low: contactList.filter(c => c.urgency_level === 'low').length
    });
  };

  const calculateStatusCounts = (contactList: ContactSubmission[]) => {
    setStatusCounts({
      all: contactList.length,
      new: contactList.filter(c => c.status === 'new').length,
      in_progress: contactList.filter(c => c.status === 'in_progress').length,
      resolved: contactList.filter(c => c.status === 'resolved').length,
      closed: contactList.filter(c => c.status === 'closed').length
    });
  };

  // Update status counts based on current urgency filter
  const updateStatusCountsForCurrentUrgency = () => {
    let urgencyFiltered = [...contacts];
    
    // Filter by urgency only (not status)
    if (activeTab !== 'all') {
      urgencyFiltered = urgencyFiltered.filter(c => c.urgency_level === activeTab);
    }
    
    // Calculate status counts from urgency-filtered contacts
    calculateStatusCounts(urgencyFiltered);
  };

  useEffect(() => {
    filterContacts();
    updateStatusCountsForCurrentUrgency();
  }, [activeTab, activeStatus, contacts]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getContactSubmissions(1, 1000);
      
      if (response.success && response.data) {
        const contactData = Array.isArray(response.data) ? response.data : [];
        
        // Sort contacts: Emergency first, then by date (newest first)
        const sortedContacts = contactData.sort((a, b) => {
          // Emergency always first
          if (a.urgency_level === 'urgent' && b.urgency_level !== 'urgent') return -1;
          if (b.urgency_level === 'urgent' && a.urgency_level !== 'urgent') return 1;
          
          // Then by date (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setContacts(sortedContacts);
        calculateCounts(sortedContacts);
        // Calculate initial status counts from all contacts
        calculateStatusCounts(sortedContacts);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Filter by urgency
    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.urgency_level === activeTab);
    }

    // Filter by status
    if (activeStatus !== 'all') {
      filtered = filtered.filter(c => c.status === activeStatus);
    }

    // Sort: Emergency first, then by date (newest first)
    filtered.sort((a, b) => {
      // Emergency always first
      if (a.urgency_level === 'urgent' && b.urgency_level !== 'urgent') return -1;
      if (b.urgency_level === 'urgent' && a.urgency_level !== 'urgent') return 1;
      // Then by date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setFilteredContacts(filtered);
  };

  const handleContactClick = (contact: ContactSubmission) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
    // Reload to refresh read status
    loadContacts();
  };

  const handleUpdateStatus = async (id: string, status: string, isRead: boolean) => {
    try {
      await apiService.updateContactSubmission(id, { status, is_read: isRead });
      // Update local state
      const updatedContacts = contacts.map(contact =>
        contact.id === id ? { ...contact, status: status as any, is_read: isRead } : contact
      );
      setContacts(updatedContacts);
      
      // Recalculate counts
      calculateCounts(updatedContacts);
      
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, status: status as any, is_read: isRead } : null);
      }
    } catch (err: any) {
      console.error('Error updating contact:', err);
      alert('Failed to update contact status');
    }
  };

  return (
    <div className="contacts-list-page">
      <div className="contacts-list-header">
        <div>
          <h1>Contact Submissions</h1>
          <p>Manage and review all contact form submissions</p>
        </div>
      </div>

      {error && (
        <div className="contacts-error">
          <p>{error}</p>
          <button onClick={loadContacts} className="btn-retry">Retry</button>
        </div>
      )}

      <UrgencyTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      <StatusFilter
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        counts={statusCounts}
      />

      <ContactsTable
        contacts={filteredContacts}
        onContactClick={handleContactClick}
        isLoading={isLoading}
      />

      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default ContactsListPage;

