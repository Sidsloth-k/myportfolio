import React from 'react';
import { Badge } from '../../ui/badge';
import { Code, Palette, TrendingUp } from 'lucide-react';

interface CompactProjectCategoryBadgeProps {
  category: string;
}

const CompactProjectCategoryBadge: React.FC<CompactProjectCategoryBadgeProps> = ({ category }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'it': return Code;
      case 'ux': return Palette;
      case 'marketing': return TrendingUp;
      default: return Code;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'it': return 'text-blue-600 bg-blue-100 border-blue-300 dark:bg-blue-950/20';
      case 'ux': return 'text-pink-600 bg-pink-100 border-pink-300 dark:bg-pink-950/20';
      case 'marketing': return 'text-green-600 bg-green-100 border-green-300 dark:bg-green-950/20';
      default: return 'text-gray-600 bg-gray-100 border-gray-300 dark:bg-gray-950/20';
    }
  };

  const CategoryIcon = getCategoryIcon(category);

  return (
    <div className="absolute top-3 right-3">
      <Badge className={`text-xs font-medium ${getCategoryColor(category)}`}>
        <CategoryIcon className="w-3 h-3 mr-1" />
        {category.toUpperCase()}
      </Badge>
    </div>
  );
};

export default CompactProjectCategoryBadge;