import React from 'react';
import { ProjectKey, ProjectConfig } from '../../types';
import { cn } from '../../lib/utils';

interface NavigationProps {
  projectConfigs: Record<ProjectKey, ProjectConfig>;
  currentProject: ProjectKey;
  onProjectChange: (project: ProjectKey) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  projectConfigs,
  currentProject,
  onProjectChange
}) => {
  return (
    <nav className="border-b border-border/20 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(projectConfigs).map(([key, project]) => {
            const isActive = currentProject === key;
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
                onClick={() => onProjectChange(key as ProjectKey)}
              >
                {project.navName || project.title.split(' - ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
