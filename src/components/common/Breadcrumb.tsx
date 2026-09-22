import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500 py-3 flex-wrap">
      <Link to="/" className="flex items-center gap-1 hover:text-[#087F78] transition-colors">
        <Home className="w-3.5 h-3.5 text-[#087F78]" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-[#087F78] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#123B3A] font-bold truncate max-w-[200px] sm:max-w-xs">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
