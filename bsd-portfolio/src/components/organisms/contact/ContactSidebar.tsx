import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';
import { ContactInfoList } from '../../molecules';

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  values?: string[]; // Support multiple values
  description: string;
  contact_type?: string; // email, phone, whatsapp, location
}

interface ContactSidebarProps {
  contactInfo: ContactInfo[];
  isInView: boolean;
  loading?: boolean;
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({
  contactInfo,
  isInView,
  loading = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="space-y-8"
    >
      {/* Contact Info Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <ContactInfoList contactInfo={contactInfo} isInView={isInView} />
      )}

      {/* Response Time Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <h4 className="text-lg font-bold hierarchy-primary mb-4">
            What Happens Next?
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">1</div>
              <span className="hierarchy-secondary">Case review within 2-4 hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</div>
              <span className="hierarchy-secondary">Initial consultation call scheduled</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-xs font-bold">3</div>
              <span className="hierarchy-secondary">Detailed proposal and timeline provided</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">4</div>
              <span className="hierarchy-secondary">Investigation begins!</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ContactSidebar; 