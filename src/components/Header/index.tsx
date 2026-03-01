import React from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href: string;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: Breadcrumb;
  config?: {
    title: string;
    subtitle: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, breadcrumb, config }) => {
  const displayTitle = title || config?.title || 'Harbour Master 64';
  const displaySubtitle = subtitle || config?.subtitle || 'Multi-Game Asset Database';

  return (
    <div className="border-b border-border/20 bg-surface/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Link to="/" className="text-text-muted hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-text-muted">/</span>
            <Link to={breadcrumb.href} className="text-text-muted hover:text-primary transition-colors">
              {breadcrumb.label}
            </Link>
            <span className="text-text-muted">/</span>
            <span className="text-text-primary">{displayTitle}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="header-text">
            <h1 className="text-3xl font-bold gradient-text">{displayTitle}</h1>
            <p className="mt-1 text-sm text-text-secondary">{displaySubtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
