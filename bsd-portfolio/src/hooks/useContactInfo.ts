import { useState, useEffect, useCallback } from 'react';
import { useApiBaseUrl } from '../utils/projects';

export interface ContactInfo {
  key: string;
  label: string;
  value: string;
  contact_values?: string[];
  description: string;
  icon_key: string;
  display_order: number;
  contact_type?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  caseType: string[];
  subject: string;
  message: string;
  urgency: string;
}

export const useContactInfo = () => {
  const apiBaseUrl = useApiBaseUrl();
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/api/contact/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contact info: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setContactInfo(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch contact info');
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Implement exponential backoff for retries
      if (retryCount < 3 && (errorMessage.includes('ERR_INSUFFICIENT_RESOURCES') || errorMessage.includes('Failed to fetch'))) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          fetchContactInfo(retryCount + 1);
        }, delay);
      }
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  return {
    contactInfo,
    loading,
    error,
    refetch: fetchContactInfo
  };
};

export const useContactSubmission = () => {
  const apiBaseUrl = useApiBaseUrl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (formData: ContactSubmission) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSubmitStatus('idle');
      
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to submit form: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus('success');
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSubmitStatus('error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitStatus,
    error,
    submitContactForm,
    resetStatus: () => setSubmitStatus('idle')
  };
};
