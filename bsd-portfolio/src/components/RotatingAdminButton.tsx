import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Cog, Database, BarChart3, FileText, Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RotatingAdminButton: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const adminIcons = [Settings, Shield, Cog, Database, BarChart3, FileText];

  const handleClick = () => {
    setIsClicked(true);
    // Add click animation delay before navigation
    setTimeout(() => {
      navigate('/admin');
      setIsClicked(false);
    }, 300);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 hover:from-primary/40 hover:to-accent/40 rounded-full flex items-center justify-center border-2 border-border hover:border-accent/50 transition-all duration-500 backdrop-blur-sm anime-shadow group overflow-hidden"
        title="Admin Dashboard"
      >
        {/* Rotating Background Ring */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, var(--accent) 90deg, transparent 180deg, var(--primary) 270deg, transparent 360deg)',
          }}
        />

        {/* Inner pulsing ring */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-2 border-2 border-accent/40 rounded-full"
        />

        {/* Floating icons around the center when not hovered */}
        <>
          {!isHovered ? (
            <motion.div
              key="rotating-icons"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              {/* Outer rotating icons */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                {adminIcons.map((Icon, index) => {
                  const angle = (index * 360) / adminIcons.length;
                  const radius = 18;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute w-4 h-4 text-accent/70"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{ 
                        rotate: [0, -360],
                        scale: [0.8, 1.3, 0.8],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 3, repeat: Infinity, delay: index * 0.3 },
                        opacity: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                      }}
                    >
                      <Icon className="w-full h-full" />
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {/* Central main gear */}
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={isClicked ? {
                    scale: [1, 0.8, 1.2, 1],
                    rotate: [0, 180, 360]
                  } : {}}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <Settings className="w-6 h-6 text-primary relative z-10" />
                  {/* Gear teeth effect */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-3 bg-primary/30 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '50% 12px',
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg)`
                      }}
                      animate={{
                        scaleY: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Orbital particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-accent rounded-full"
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                  animate={{
                    x: Math.cos((i * 90 + Date.now() * 0.001) * Math.PI / 180) * 25,
                    y: Math.sin((i * 90 + Date.now() * 0.001) * Math.PI / 180) * 25,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="admin-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateY: { duration: 2, repeat: Infinity },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className="mb-1"
              >
                <Lock className="w-5 h-5 text-primary" />
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                className="text-xs font-semibold hierarchy-primary whitespace-nowrap overflow-hidden"
              >
                Admin
              </motion.div>
            </motion.div>
          )}
        </>

        {/* Click ripple effect */}
        <>
          {isClicked && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 bg-accent/30 rounded-full"
            />
          )}
        </>

        {/* Glow effect on hover */}
        <motion.div
          animate={isHovered ? {
            scale: [1, 1.5, 1],
            opacity: [0, 0.4, 0]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg"
        />
      </motion.button>

      {/* Expanded text panel on hover */}
      <>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 whitespace-nowrap z-50"
          >
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              className="bg-card/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 anime-shadow relative overflow-hidden"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Key className="w-4 h-4 text-accent" />
                  </motion.div>
                  <span className="text-base font-semibold hierarchy-primary">Admin Panel</span>
                </div>
                <div className="text-sm hierarchy-tertiary">Detective Dashboard Access</div>
                <div className="text-xs hierarchy-tertiary mt-1">Click to enter secure area</div>
              </div>
              
              {/* Animated border */}
              <motion.div
                animate={{ 
                  background: [
                    'linear-gradient(0deg, var(--accent), transparent, var(--primary), transparent)',
                    'linear-gradient(360deg, var(--accent), transparent, var(--primary), transparent)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-xl opacity-30"
                style={{ padding: '1px' }}
              />
            </motion.div>
            
            {/* Arrow pointing to button */}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-border"
              />
            </div>
          </motion.div>
        )}
      </>

      {/* Energy particles on hover */}
      <>
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`energy-${i}`}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 2, 0],
                  x: Math.cos((i * 45) * Math.PI / 180) * 40,
                  y: Math.sin((i * 45) * Math.PI / 180) * 40
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut'
                }}
                className="absolute w-2 h-2 bg-accent/60 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-sm"
              />
            ))}
          </>
        )}
      </>

      {/* Pulsing outer ring */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 border border-accent/20 rounded-full"
      />

      {/* Secondary pulsing ring */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
        className="absolute inset-1 border border-primary/20 rounded-full"
      />
    </div>
  );
};

export default RotatingAdminButton;