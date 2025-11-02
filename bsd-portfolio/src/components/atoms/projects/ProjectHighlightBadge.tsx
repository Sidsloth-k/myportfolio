import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';
import { Star } from 'lucide-react';

interface ProjectHighlightBadgeProps {
  highlight: string;
  highlight_background_color?: string;
  index: number;
}

const ProjectHighlightBadge: React.FC<ProjectHighlightBadgeProps> = ({ highlight, highlight_background_color, index }) => {
  // Determine text color based on background brightness for better contrast
  const getTextColor = (bgColor: string): string => {
    if (!bgColor) return '#fff';
    // Remove # if present
    let hex = bgColor.replace('#', '');
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    if (hex.length !== 6) return '#fff'; // Fallback if invalid
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const badgeStyle = highlight_background_color 
    ? { 
        backgroundColor: highlight_background_color,
        color: getTextColor(highlight_background_color),
        borderColor: 'transparent'
      } as React.CSSProperties
    : undefined;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: -12 }}
      transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
      className="absolute top-4 left-4"
    >
      {highlight_background_color ? (
        <span 
          className="px-3 py-1 font-semibold anime-shadow rounded-md border inline-flex items-center justify-center"
          style={badgeStyle}
        >
          <Star className="w-3 h-3 mr-1" />
          {highlight}
        </span>
      ) : (
        <Badge 
          variant="default"
          className="px-3 py-1 font-semibold anime-shadow bg-accent text-accent-foreground"
        >
          <Star className="w-3 h-3 mr-1" />
          {highlight}
        </Badge>
      )}
    </motion.div>
  );
};

export default ProjectHighlightBadge; 