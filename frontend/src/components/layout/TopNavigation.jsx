import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopNavigation = ({ user }) => {
  const location = useLocation();

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Team', path: '/team' },
    { label: 'Reviews', path: '/feedback' },
    { label: 'HR Insights', path: '/hr-insights' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-surface-variant h-20">
      <div className="flex justify-between items-center w-full px-margin-desktop h-full max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/dashboard" className="font-headline-lg text-headline-lg font-bold text-primary">Sowaka</Link>
          <nav className="hidden md:flex gap-8 h-20 items-center mt-1">
            {links.map((link, idx) => {
              const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={idx}
                  to={link.path}
                  className={`font-label-md text-label-md transition-all duration-200 h-full flex items-center border-b-2 pt-1 ${
                    isActive 
                      ? "text-primary border-primary opacity-100" 
                      : "text-on-surface-variant border-transparent hover:text-primary opacity-80 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
            <input className="bg-transparent border-none outline-none text-sm w-48" placeholder="Search insights..." type="text" />
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
            <img className="w-full h-full object-cover" src={user?.avatar || "https://i.pravatar.cc/150"} alt={user?.name || "User"} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
