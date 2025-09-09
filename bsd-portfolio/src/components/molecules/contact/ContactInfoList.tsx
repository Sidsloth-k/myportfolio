import React from 'react';
import { ContactInfoCard } from '../../atoms';

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
}

interface ContactInfoListProps {
  contactInfo: ContactInfo[];
  isInView: boolean;
}

const ContactInfoList: React.FC<ContactInfoListProps> = ({
  contactInfo,
  isInView
}) => {
  return (
    <div className="space-y-6">
      {contactInfo.map((info, index) => (
        <ContactInfoCard
          key={index}
          info={info}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  );
};

export default ContactInfoList; 