import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { localCacheManager } from '../../utils/localCache';
import { useContactContext } from '../../contexts/ContactContext';

type Props = {
  onNavigate: (page: string) => void;
};

const SiteFooter: React.FC<Props> = ({ onNavigate }) => {
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);
  const { contactInfo, loading: contactLoading } = useContactContext();

  // Debug: Log contact info to see what we're getting
  React.useEffect(() => {
    if (contactInfo.length > 0) {
      console.log('📞 Contact info received:', contactInfo);
    }
  }, [contactInfo]);

  // Handle contact actions
  const handleContactClick = (value: string, contactType?: string) => {
    if (contactType === 'email' || value.includes('@')) {
      window.open(`mailto:${value}`, '_blank');
    } else if (contactType === 'whatsapp') {
      const phoneNumber = value.replace(/[^\d+]/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else if (contactType === 'phone') {
      const phoneNumber = value.replace(/[^\d+]/g, '');
      window.open(`tel:${phoneNumber}`, '_blank');
    } else if (contactType === 'location') {
      window.open(`https://maps.google.com/maps?q=${encodeURIComponent(value)}`, '_blank');
    }
  };

  const clearCache = async () => {
    setIsClearingCache(true);
    setCacheStatus(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/cache/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCacheStatus('Cache cleared successfully! ✨');
        // Clear local cache using the cache manager
        await localCacheManager.clear();
        // Also clear any additional localStorage items
        localStorage.removeItem('portfolio-cache');
        localStorage.removeItem('projects-cache');
        localStorage.removeItem('skills-cache');
        localStorage.removeItem('portfolio_session_id');
        // Reload the page to get fresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setCacheStatus('Failed to clear cache');
      }
    } catch (error) {
      setCacheStatus('Error clearing cache');
      console.error('Cache clear error:', error);
    } finally {
      setIsClearingCache(false);
    }
  };

  return (
  <motion.footer
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="bg-gradient-to-r from-card to-muted border-t border-border py-12 px-6 relative overflow-hidden z-10"
  >
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
    </div>

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <motion.h3 
            whileHover={{ scale: 1.02 }}
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Armed Detective Agency
          </motion.h3>
          <p className="hierarchy-secondary mb-6 leading-relaxed text-lg">
            Solving digital mysteries with the precision of detective work 
            and the creativity of literary mastery. Sidney brings together 
            IT expertise, design elegance, and marketing strategy to create 
            solutions that inspire and deliver results.
          </p>
          <div className="italic text-accent text-lg bg-accent/10 p-4 rounded-xl border border-accent/20">
            "Every project is a story waiting to be told, every challenge a mystery waiting to be solved."
            <div className="text-sm font-semibold mt-2 hierarchy-primary">— Dazai Osamu</div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-6 text-accent">
            Case Files
          </h4>
          <div className="space-y-3">
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((link) => (
              <motion.button
                key={link}
                whileHover={{ x: 8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(link.toLowerCase())}
                className="block hierarchy-secondary hover:text-primary transition-colors text-lg py-1"
              >
                {link}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 min-w-0">
          <h4 className="text-xl font-semibold mb-6 text-accent">
            Connect & Manage
          </h4>
           <div className="space-y-2 hierarchy-secondary mb-6">
             {contactLoading ? (
               <div className="space-y-2">
                 <div className="h-4 bg-muted rounded animate-pulse"></div>
                 <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                 <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
               </div>
             ) : contactInfo.length > 0 ? (
               contactInfo
                 .filter(item => !item.key.includes('emergency')) // Remove emergency line
                 .sort((a, b) => a.display_order - b.display_order)
                 .map((item, index) => (
                   <div key={item.key} className="space-y-1 min-w-0">
                     <div className="text-accent font-medium text-sm">{item.label}:</div>
                     <div className="flex flex-wrap gap-1 min-w-0">
                       {item.contact_values && item.contact_values.length > 0 ? (
                         item.contact_values.map((value, valueIndex) => (
                           <button
                             key={valueIndex}
                             onClick={() => handleContactClick(value, item.contact_type)}
                             className="whitespace-nowrap text-lg text-left hover:text-accent transition-colors cursor-pointer"
                           >
                             {value}
                             {valueIndex < (item.contact_values?.length || 0) - 1 && <span className="text-muted-foreground">,</span>}
                           </button>
                         ))
                       ) : (
                         <button
                           onClick={() => handleContactClick(item.value, item.contact_type)}
                           className="whitespace-nowrap text-lg text-left hover:text-accent transition-colors cursor-pointer"
                         >
                           {item.value}
                         </button>
                       )}
                     </div>
                   </div>
                 ))
             ) : (
               // Fallback contact information if API fails
               <>
                 <div className="space-y-1 min-w-0">
                   <div className="text-accent font-medium text-sm">Email:</div>
                   <button
                     onClick={() => handleContactClick('sidney@detective-agency.dev', 'email')}
                     className="text-lg text-left hover:text-accent transition-colors cursor-pointer"
                   >
                     sidney@detective-agency.dev
                   </button>
                 </div>
                 <div className="space-y-1 min-w-0">
                   <div className="text-accent font-medium text-sm">Location:</div>
                   <button
                     onClick={() => handleContactClick('Yokohama, Japan', 'location')}
                     className="text-lg text-left hover:text-accent transition-colors cursor-pointer"
                   >
                     Yokohama, Japan
                   </button>
                 </div>
                 <div className="space-y-1 min-w-0">
                   <div className="text-accent font-medium text-sm">Phone:</div>
                   <button
                     onClick={() => handleContactClick('+81-XX-XXXX-XXXX', 'phone')}
                     className="text-lg text-left hover:text-accent transition-colors cursor-pointer"
                   >
                     +81-XX-XXXX-XXXX
                   </button>
                 </div>
               </>
             )}
          </div>
          
          {/* Cache Clear Button */}
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearCache}
              disabled={isClearingCache}
              className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-md px-3 py-1.5 text-xs font-medium text-accent hover:from-accent/20 hover:to-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClearingCache ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full"
                  />
                  <span>Clearing Cache...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🗑️</span>
                  <span>Clear Cache</span>
                </div>
              )}
            </motion.button>
            
            {cacheStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-center"
                style={{ 
                  color: cacheStatus.includes('successfully') ? '#10B981' : '#EF4444' 
                }}
              >
                {cacheStatus}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="hierarchy-tertiary text-sm">
          © 2024 Sidney's Portfolio. Inspired by Bungou Stray Dogs.
        </div>
        <div className="hierarchy-tertiary text-sm mt-4 md:mt-0 flex items-center space-x-2">
          <span>Built with React, TypeScript, and Anime Magic</span>
          <motion.span 
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-accent"
          >
            ✨
          </motion.span>
        </div>
      </div>
    </div>
  </motion.footer>
  );
};

export default SiteFooter;


