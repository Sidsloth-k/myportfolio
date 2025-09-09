import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  level: number;
  index: number;
  isInView: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ level, index, isInView }) => {
  const getStars = (level: number) => {
    const fullStars = Math.floor(level / 20);
    const hasHalfStar = level % 20 >= 10;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: fullStars,
      half: hasHalfStar ? 1 : 0,
      empty: emptyStars
    };
  };

  const stars = getStars(level);

  return (
    <div className="flex justify-center items-center space-x-1 mb-2">
      {/* Full Stars */}
      {[...Array(stars.full)].map((_, i) => (
        <motion.div
          key={`full-${i}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3 + index * 0.1 + i * 0.05, type: 'spring' }}
        >
          <Star className="w-3 h-3 text-accent fill-current" />
        </motion.div>
      ))}
      
      {/* Half Star */}
      {stars.half > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3 + index * 0.1 + stars.full * 0.05, type: 'spring' }}
          className="relative"
        >
          <Star className="w-3 h-3 text-muted-foreground" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-3 h-3 text-accent fill-current" />
          </div>
        </motion.div>
      )}
      
      {/* Empty Stars */}
      {[...Array(stars.empty)].map((_, i) => (
        <motion.div
          key={`empty-${i}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3 + index * 0.1 + (stars.full + stars.half + i) * 0.05, type: 'spring' }}
        >
          <Star className="w-3 h-3 text-muted-foreground" />
        </motion.div>
      ))}
    </div>
  );
};

export default StarRating;