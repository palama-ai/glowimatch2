import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbMap = {
    '/landing-page': { label: 'Home', parent: null },
    '/interactive-skin-quiz': { label: 'Skin Quiz', parent: '/landing-page' },
    '/image-upload-analysis': { label: 'Image Analysis', parent: '/interactive-skin-quiz' },
    '/results-dashboard': { label: 'My Results', parent: '/image-upload-analysis' }
  };

  const getBreadcrumbs = () => {
    const currentPath = location?.pathname === '/' ? '/landing-page' : location?.pathname;
    const breadcrumbs = [];
    let path = currentPath;

    while (path && breadcrumbMap?.[path]) {
      breadcrumbs?.unshift({
        label: breadcrumbMap?.[path]?.label,
        path: path,
        isActive: path === currentPath
      });
      path = breadcrumbMap?.[path]?.parent;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on landing page or if only one item
  if (location?.pathname === '/landing-page' || location?.pathname === '/' || breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 animate-fade-in">
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
          )}
          <button
            onClick={() => handleNavigation(crumb?.path)}
            className={`transition-colors duration-200 hover:text-foreground ${
              crumb?.isActive 
                ? 'text-foreground font-medium cursor-default' 
                : 'text-muted-foreground hover:text-accent cursor-pointer'
            }`}
            disabled={crumb?.isActive}
          >
            {crumb?.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;