import React from 'react';
import { SubcategoryConfig } from '../../types';
import { cn } from '../../lib/utils';

interface SubcategorySelectorProps {
  subcategories: Record<string, SubcategoryConfig>;
  currentSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  subcategories,
  currentSubcategory,
  onSubcategoryChange
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-2">
        {Object.entries(subcategories).map(([key, sub]) => {
          const isActive = currentSubcategory === key;
          return (
            <button
              key={key}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                'glass glass-border',
                isActive
                  ? 'bg-primary/20 text-primary border-primary/50 shadow-md'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary/10'
              )}
              onClick={() => onSubcategoryChange(key)}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubcategorySelector;
