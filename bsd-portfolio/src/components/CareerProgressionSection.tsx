import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building, Calendar, User, ArrowDown, ArrowRight, ExternalLink, MapPin, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const CareerProgressionSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showFullChart, setShowFullChart] = useState(false);

  // BSD Characters for career milestones
  const bsdCharacters = {
    'dazai': { name: 'Dazai', icon: '🕴️', color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/20' },
    'kunikida': { name: 'Kunikida', icon: '📋', color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/20' },
    'atsushi': { name: 'Atsushi', icon: '🐅', color: 'text-orange-600 bg-orange-100 dark:bg-orange-950/20' },
    'akutagawa': { name: 'Akutagawa', icon: '⚔️', color: 'text-gray-600 bg-gray-100 dark:bg-gray-950/20' },
    'chuuya': { name: 'Chuuya', icon: '🎩', color: 'text-red-600 bg-red-100 dark:bg-red-950/20' },
    'ranpo': { name: 'Ranpo', icon: '🔍', color: 'text-green-600 bg-green-100 dark:bg-green-950/20' }
  };

  const careerData = [
    {
      id: 'freelance-start',
      company: 'Independent Detective',
      location: 'Remote/Yokohama',
      period: '2020 - 2021',
      type: 'Freelance',
      level: 'entry',
      description: 'Started the detective journey with small digital investigations',
      positions: [
        {
          title: 'Junior Web Detective',
          duration: '6 months',
          startDate: '2020-01',
          endDate: '2020-06',
          character: 'atsushi',
          achievements: [
            'Solved first 5 digital mysteries',
            'Learned React fundamentals',
            'Built first portfolio website'
          ]
        },
        {
          title: 'Freelance Developer',
          duration: '12 months',
          startDate: '2020-07',
          endDate: '2021-06',
          character: 'dazai',
          achievements: [
            'Completed 15+ client projects',
            'Mastered JavaScript and Node.js',
            'Developed signature detective coding style'
          ]
        }
      ]
    },
    {
      id: 'tech-startup',
      company: 'Digital Mysteries Inc.',
      location: 'Yokohama, Japan',
      period: '2021 - 2022',
      type: 'Startup',
      level: 'mid',
      description: 'Joined a tech startup specializing in solving complex digital challenges',
      positions: [
        {
          title: 'Frontend Detective',
          duration: '8 months',
          startDate: '2021-07',
          endDate: '2022-02',
          character: 'kunikida',
          achievements: [
            'Led UI/UX redesign project',
            'Implemented design system',
            'Improved user engagement by 40%'
          ]
        },
        {
          title: 'Full-Stack Investigator',
          duration: '6 months',
          startDate: '2022-03',
          endDate: '2022-08',
          character: 'ranpo',
          achievements: [
            'Architected microservices backend',
            'Built real-time analytics dashboard',
            'Reduced system load times by 60%'
          ]
        }
      ]
    },
    {
      id: 'marketing-agency',
      company: 'Port Mafia Marketing',
      location: 'Yokohama, Japan',
      period: '2022 - 2023',
      type: 'Agency',
      level: 'mid',
      description: 'Expanded detective skills into marketing analytics and growth strategies',
      positions: [
        {
          title: 'Digital Marketing Detective',
          duration: '12 months',
          startDate: '2022-09',
          endDate: '2023-08',
          character: 'chuuya',
          achievements: [
            'Developed data-driven marketing strategies',
            'Increased client ROI by 250%',
            'Mastered Google Analytics and Ad platforms'
          ]
        }
      ]
    },
    {
      id: 'current-agency',
      company: 'Armed Detective Agency',
      location: 'Yokohama, Japan',
      period: '2023 - Present',
      type: 'Independent Agency',
      level: 'senior',
      description: 'Founded own detective agency, combining all skills for comprehensive digital solutions',
      positions: [
        {
          title: 'Lead Detective & Founder',
          duration: 'Ongoing',
          startDate: '2023-09',
          endDate: 'present',
          character: 'dazai',
          achievements: [
            'Successfully solved 25+ complex cases',
            'Built team of specialized detectives',
            'Achieved 100% client satisfaction rate',
            'Established agency reputation in industry'
          ]
        }
      ]
    }
  ];

  // Only show first 4 companies in compact view
  const compactCareerData = careerData.slice(0, 4);
  const displayData = showFullChart ? careerData : compactCareerData;

  const getCharacterInfo = (characterKey: string) => {
    return bsdCharacters[characterKey as keyof typeof bsdCharacters] || bsdCharacters['dazai'];
  };

  const CompanyCard = ({ company, index, isLast }: { company: any; index: number; isLast: boolean }) => {
    const isSelected = selectedCompany === company.id;
    
    const handleClick = () => {
      setSelectedCompany(isSelected ? null : company.id);
    };
    
    return (
      <div className="relative">
        {/* Company Card */}
        <div
          onClick={handleClick}
          className="cursor-pointer group"
        >
          <Card className={`p-6 hover:border-accent/50 transition-all duration-300 anime-shadow relative overflow-hidden ${
            isSelected ? 'border-accent anime-glow' : 'border-border'
          } hover:shadow-lg hover:shadow-accent/20 group-hover:bg-muted/20`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary" />
            </div>

            <div className="relative z-10">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold hierarchy-primary">{company.company}</h3>
                    <div className="flex items-center space-x-2 text-sm hierarchy-tertiary">
                      <MapPin className="w-3 h-3" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={`text-xs ${
                  company.level === 'senior' ? 'bg-green-100 text-green-800 border-green-300' :
                  company.level === 'mid' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  'bg-yellow-100 text-yellow-800 border-yellow-300'
                }`}>
                  {company.level}
                </Badge>
              </div>

              {/* Period and Type */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="hierarchy-secondary font-medium">{company.period}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {company.type}
                </Badge>
              </div>

              {/* Description */}
              <p className="hierarchy-tertiary text-sm leading-relaxed mb-4">
                {company.description}
              </p>
              


              {/* Position Count and Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm hierarchy-secondary">
                  {company.positions.length} position{company.positions.length !== 1 ? 's' : ''}
                </span>
                <motion.div
                  animate={{ rotate: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowDown className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
              
              {/* Prominent Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground border-accent hover:from-primary hover:to-accent hover:text-accent-foreground transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  {isSelected ? 'Hide Details' : 'View Details'}
                </Button>
              </motion.div>
            </div>
          </Card>
        </div>

        {/* Connection Arrow (except for last item) */}
        {!isLast && (
          <div className="flex justify-center my-4 sm:my-6">
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-full flex items-center justify-center"
            >
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </motion.div>
          </div>
        )}

        {/* Position Details (Expandable) */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-4 space-y-4 overflow-hidden"
          >
              {company.positions.map((position: any, posIndex: number) => {
                const characterInfo = getCharacterInfo(position.character);
                
                return (
                  <motion.div
                    key={posIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: posIndex * 0.15, duration: 0.4, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="p-4 bg-muted/30 border-border hover:border-accent/30 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        {/* BSD Character Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${characterInfo.color}`}>
                          {characterInfo.icon}
                        </div>
                        
                        <div className="flex-1">
                          {/* Position Header */}
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold hierarchy-primary">{position.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {position.duration}
                            </Badge>
                          </div>
                          
                          {/* Duration */}
                          <div className="text-sm hierarchy-tertiary mb-3">
                            {position.startDate} - {position.endDate}
                          </div>
                          
                          {/* Achievements */}
                          <div>
                            <h5 className="text-sm font-medium hierarchy-secondary mb-2">Key Achievements:</h5>
                            <ul className="space-y-1">
                              {position.achievements.map((achievement: string, achIndex: number) => (
                                <motion.li
                                  key={achIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: posIndex * 0.1 + achIndex * 0.05 }}
                                  className="text-sm hierarchy-tertiary flex items-start space-x-2"
                                >
                                  <Award className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                                  <span>{achievement}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Character Badge */}
                          <div className="mt-3 pt-2 border-t border-border">
                            <Badge className={`text-xs ${characterInfo.color}`}>
                              Mentored by {characterInfo.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
      </div>
    );
  };

  return (
    <section ref={containerRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold hierarchy-primary mb-4 sm:mb-6">
            Career
          </h2>
          <p className="text-lg sm:text-xl hierarchy-secondary max-w-3xl mx-auto px-4">
            The detective's journey through different agencies and organizations, 
            each chapter building upon the previous to create a comprehensive skill set.
          </p>
          
          {/* Career Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mt-6 sm:mt-8"
          >
            <div className="text-center p-3 sm:p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
              <div className="text-xl sm:text-2xl font-bold hierarchy-primary">4+</div>
              <div className="text-xs hierarchy-tertiary">Years Experience</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
              <div className="text-xl sm:text-2xl font-bold hierarchy-primary">{careerData.length}</div>
              <div className="text-xs hierarchy-tertiary">Organizations</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
              <div className="text-xl sm:text-2xl font-bold hierarchy-primary">
                {careerData.reduce((acc, company) => acc + company.positions.length, 0)}
              </div>
              <div className="text-xs hierarchy-tertiary">Positions</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
              <div className="text-xl sm:text-2xl font-bold hierarchy-primary">100%</div>
              <div className="text-xs hierarchy-tertiary">Growth Rate</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Career Timeline */}
        <div className="space-y-4 sm:space-y-6">
          {displayData.map((company, index) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              index={index} 
              isLast={index === displayData.length - 1}
            />
          ))}
        </div>

        {/* View Full Chart Button (if there are more than 4 companies) */}
        {careerData.length > 4 && !showFullChart && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => setShowFullChart(true)}
              size="lg"
              className="bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-accent-foreground px-10 py-6 text-lg font-bold anime-shadow"
            >
              <ExternalLink className="w-6 h-6 mr-3" />
              View Full Career Progression
            </Button>
            <p className="text-sm hierarchy-tertiary mt-3">
              See complete timeline with {careerData.length - 4} additional companies
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold hierarchy-primary mb-4">
              BSD Character Mentorship Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(bsdCharacters).map(([key, character]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${character.color}`}>
                    {character.icon}
                  </div>
                  <span className="hierarchy-secondary text-sm">{character.name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm hierarchy-tertiary mt-4 italic">
              Each position was influenced by the wisdom and methods of different BSD characters, 
              shaping the detective's approach to problem-solving and professional growth.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerProgressionSection;