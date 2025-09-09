import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  onNavigate: (page: string) => void;
};

const SiteFooter: React.FC<Props> = ({ onNavigate }) => (
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

        <div>
          <h4 className="text-xl font-semibold mb-6 text-accent">
            Connect & Manage
          </h4>
          <div className="space-y-3 hierarchy-secondary mb-6">
            <div className="text-lg">sidney@detective-agency.dev</div>
            <div>Yokohama, Japan</div>
            <div>Available 24/7 for emergencies</div>
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

export default SiteFooter;


