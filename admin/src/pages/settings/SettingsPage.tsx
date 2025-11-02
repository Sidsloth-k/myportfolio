import React, { useState, useEffect } from 'react';
import { ContactInfoTable, ContactInfoModal } from '../../components/organisms/contact';
import { ContactInfo } from '../../components/molecules/contact/ContactInfoRow';
import apiService from '../../services/api';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContactInfo, setSelectedContactInfo] = useState<ContactInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadContactInfos();
  }, []);

  const loadContactInfos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAllContactInfo();
      if (response.success && response.data) {
        setContactInfos(response.data as ContactInfo[]);
      } else {
        setError(response.error || 'Failed to load contact information');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load contact information');
      console.error('Error loading contact infos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedContactInfo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contactInfo: ContactInfo) => {
    setSelectedContactInfo(contactInfo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContactInfo(null);
  };

  const handleSave = async (data: Partial<ContactInfo>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (selectedContactInfo) {
        // Update existing
        const response = await apiService.updateContactInfo(selectedContactInfo.key, data);
        if (response.success) {
          await loadContactInfos();
          handleCloseModal();
        } else {
          setError(response.error || 'Failed to update contact information');
        }
      } else {
        // Create new
        if (!data.key || !data.label || !data.value) {
          setError('Key, label, and value are required');
          return;
        }
        const response = await apiService.createContactInfo({
          key: data.key,
          label: data.label,
          value: data.value,
          contact_values: data.contact_values,
          description: data.description,
          icon_key: data.icon_key,
          display_order: data.display_order || 0,
          contact_type: data.contact_type || 'email'
        });
        if (response.success) {
          await loadContactInfos();
          handleCloseModal();
        } else {
          setError(response.error || 'Failed to create contact information');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save contact information');
      console.error('Error saving contact info:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      setError(null);
      const response = await apiService.deleteContactInfo(key, false);
      if (response.success) {
        await loadContactInfos();
      } else {
        setError(response.error || 'Failed to delete contact information');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact information');
      console.error('Error deleting contact info:', err);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage contact information and other settings</p>
      </div>

      {error && (
        <div className="settings-error">
          <i className="bx bx-error-circle"></i>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="btn-close-error">
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Contact Information</h2>
          <button className="btn-create" onClick={handleCreate}>
            <i className="bx bx-plus"></i>
            Add Contact Info
          </button>
        </div>

        <div className="settings-section-content">
          <ContactInfoTable
            contactInfos={contactInfos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isModalOpen && (
        <ContactInfoModal
          contactInfo={selectedContactInfo}
          onClose={handleCloseModal}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default SettingsPage;

