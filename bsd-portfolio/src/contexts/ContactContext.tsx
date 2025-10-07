import React, { createContext, useContext, ReactNode } from 'react';
import { useContactInfo, ContactInfo } from '../hooks/useContactInfo';

interface ContactContextType {
  contactInfo: ContactInfo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const contactData = useContactInfo();

  return (
    <ContactContext.Provider value={contactData}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
};
