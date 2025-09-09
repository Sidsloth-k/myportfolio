import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Code, Database, Server, Smartphone, Globe, GitBranch,
  Palette, Figma, Layers, MousePointer, Eye, Sparkles,
  TrendingUp, Target, BarChart3, Megaphone, Users, Zap
} from 'lucide-react';

const SkillsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const itSkills = [
    { icon: Code, name: 'Full-Stack Development', level: 95, description: 'React, Node.js, Python' },
    { icon: Database, name: 'Database Management', level: 90, description: 'PostgreSQL, MongoDB, Redis' },
    { icon: Server, name: 'Cloud Architecture', level: 88, description: 'AWS, Docker, Kubernetes' },
    { icon: Smartphone, name: 'Mobile Development', level: 85, description: 'React Native, Flutter' },
    { icon: Globe, name: 'Web Technologies', level: 92, description: 'TypeScript, Next.js, GraphQL' },
    { icon: GitBranch, name: 'DevOps & CI/CD', level: 87, description: 'GitHub Actions, Jenkins' }
  ];

  const uxSkills = [
    { icon: Figma, name: 'Interface Design', level: 93, description: 'Figma, Adobe Creative Suite' },
    { icon: Layers, name: 'Design Systems', level: 89, description: 'Component Libraries, Style Guides' },
    { icon: MousePointer, name: 'User Experience', level: 91, description: 'User Research, Prototyping' },
    { icon: Eye, name: 'Visual Design', level: 88, description: 'Typography, Color Theory' },
    { icon: Sparkles, name: 'Animation & Motion', level: 86, description: 'Framer Motion, Lottie' },
    { icon: Palette, name: 'Brand Identity', level: 84, description: 'Logo Design, Brand Guidelines' }
  ];

  const marketingSkills = [
    { icon: TrendingUp, name: 'Growth Strategy', level: 90, description: 'SEO, SEM, Analytics' },
    { icon: Target, name: 'Campaign Management', level: 87, description: 'Google Ads, Facebook Ads' },
    { icon: BarChart3, name: 'Data Analysis', level: 89, description: 'Google Analytics, Mixpanel' },
    { icon: Megaphone, name: 'Content Marketing', level: 85, description: 'Copywriting, Social Media' },
    { icon: Users, name: 'Customer Acquisition', level: 88, description: 'Funnel Optimization, A/B Testing' },
    { icon: Zap, name: 'Marketing Automation', level: 83, description: 'HubSpot, Mailchimp, Zapier' }
  ];

  const SkillCard = ({ skill, index, category }: { skill: any, index: number, category: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isCardInView = useInView(cardRef, { once: true });

    const getAnimationProps = () => {
      switch (category) {
        case 'it':
          return {
            initial: { opacity: 0, x: -50, rotateY: -45 },
            animate: isCardInView ? { opacity: 1, x: 0, rotateY: 0 } : {},
            transition: { duration: 0.6, delay: index * 0.1 },
            whileHover: { 
              scale: 1.05, 
              rotateY: 10,
              boxShadow: '0 20px 40px rgba(74, 55, 40, 0.3)'
            }
          };
        case 'ux':
          return {
            initial: { opacity: 0, y: 30, scale: 0.9 },
            animate: isCardInView ? { opacity: 1, y: 0, scale: 1 } : {},
            transition: { duration: 0.8, delay: index * 0.15, type: 'spring' },
            whileHover: { 
              scale: 1.08, 
              y: -10,
              boxShadow: '0 25px 50px rgba(201, 169, 110, 0.3)'
            }
          };
        case 'marketing':
          return {
            initial: { opacity: 0, scale: 0, rotate: -180 },
            animate: isCardInView ? { opacity: 1, scale: 1, rotate: 0 } : {},
            transition: { duration: 0.7, delay: index * 0.12, type: 'spring', bounce: 0.4 },
            whileHover: { 
              scale: 1.1, 
              rotate: 5,
              boxShadow: '0 15px 35px rgba(42, 32, 22, 0.4)'
            }
          };
        default:
          return {};
      }
    };

    const getCategoryTheme = () => {
      switch (category) {
        case 'it':
          return {
            bg: 'bg-gradient-to-br from-dazai-brown/10 to-dazai-dark/10',
            border: 'border-dazai-brown/30',
            iconBg: 'bg-dazai-brown/20',
            iconColor: 'text-dazai-brown',
            progressBg: 'bg-dazai-brown',
            title: 'text-dazai-brown'
          };
        case 'ux':
          return {
            bg: 'bg-gradient-to-br from-dazai-gold/10 to-dazai-beige/10',
            border: 'border-dazai-gold/30',
            iconBg: 'bg-dazai-gold/20',
            iconColor: 'text-dazai-gold',
            progressBg: 'bg-dazai-gold',
            title: 'text-dazai-gold'
          };
        case 'marketing':
          return {
            bg: 'bg-gradient-to-br from-dazai-dark/10 to-dazai-muted/10',
            border: 'border-dazai-dark/30',
            iconBg: 'bg-dazai-dark/20',
            iconColor: 'text-dazai-dark',
            progressBg: 'bg-dazai-dark',
            title: 'text-dazai-dark'
          };
        default:
          return {};
      }
    };

    const theme = getCategoryTheme();
    const animProps = getAnimationProps();

    return (
      <motion.div
        ref={cardRef}
        {...animProps}
        className={`${theme.bg} ${theme.border} border rounded-2xl p-6 backdrop-blur-sm anime-shadow`}
      >
        <div className="flex items-start space-x-4">
          <motion.div
            animate={category === 'it' ? { rotate: [0, 360] } : {}}
            transition={category === 'it' ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
            className={`${theme.iconBg} p-3 rounded-xl`}
          >
            <skill.icon className={`w-6 h-6 ${theme.iconColor}`} />
          </motion.div>
          
          <div className="flex-1">
            <h4 className={`${theme.title} font-semibold mb-1`}>{skill.name}</h4>
            <p className="text-dazai-muted text-sm mb-3">{skill.description}</p>
            
            {/* Skill Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dazai-muted">Proficiency</span>
                <span className={theme.title}>{skill.level}%</span>
              </div>
              <div className="w-full bg-dazai-beige/30 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isCardInView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                  className={`${theme.progressBg} h-2 rounded-full relative`}
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full opacity-80"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const SkillCategory = ({ 
    title, 
    subtitle, 
    skills, 
    category, 
    characterQuote 
  }: { 
    title: string, 
    subtitle: string, 
    skills: any[], 
    category: string,
    characterQuote: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mb-20"
    >
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-dazai-dark mb-4">{title}</h3>
        <p className="text-lg text-dazai-muted mb-6">{subtitle}</p>
        <div className="italic text-dazai-brown max-w-2xl mx-auto">
          "{characterQuote}"
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <SkillCard 
            key={skill.name} 
            skill={skill} 
            index={index} 
            category={category} 
          />
        ))}
      </div>
    </motion.div>
  );

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <motion.div style={{ y }} className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-dazai-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-dazai-brown/10 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-dazai-dark mb-6">
            Abilities & Techniques
          </h2>
          <p className="text-xl text-dazai-muted max-w-3xl mx-auto">
            Like the diverse abilities of the Armed Detective Agency, Sidney's skills 
            span multiple domains, each mastered with precision and creativity.
          </p>
        </motion.div>

        {/* IT Skills - Dazai's Strategic Mind */}
        <SkillCategory
          title="IT Development - Strategic Architecture"
          subtitle="Building systems with the precision of Dazai's master plans"
          skills={itSkills}
          category="it"
          characterQuote="Every line of code is a step in a grander scheme. Efficiency and elegance, just like my strategies."
        />

        {/* UI/UX Skills - Aesthetic Mastery */}
        <SkillCategory
          title="UI/UX Design - Aesthetic Mastery"
          subtitle="Crafting interfaces with the sophistication of Port Mafia elegance"
          skills={uxSkills}
          category="ux"
          characterQuote="Beauty lies in simplicity, but depth makes it memorable. Much like a well-wrapped bandage."
        />

        {/* Marketing Skills - Psychological Warfare */}
        <SkillCategory
          title="Marketing Strategy - Psychological Influence"
          subtitle="Understanding minds and markets with detective-level insight"
          skills={marketingSkills}
          category="marketing"
          characterQuote="Understanding human psychology is the key to any successful campaign. People are predictably unpredictable."
        />
      </div>
    </section>
  );
};

export default SkillsSection;