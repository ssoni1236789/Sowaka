import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ logoIcon, logoText, subtitle, navigation, onAction, actionLabel, actionIcon: ActionIcon }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#F5F1EB] border-r border-sowaka-border flex flex-col fixed h-full z-10">
      <div className="p-8">
        <div 
          className="flex items-center gap-2 text-sowaka-primary text-2xl font-serif font-bold tracking-tight cursor-pointer" 
          onClick={() => navigate('/dashboard')}
        >
          {logoIcon && <span>{logoIcon}</span>}
          {logoText}
        </div>
        {subtitle && (
          <div className={`text-[10px] uppercase tracking-widest text-sowaka-textMuted font-bold mt-1 ${logoIcon ? 'ml-8' : ''}`}>
            {subtitle}
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
        {navigation.map((item, idx) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                isActive 
                  ? "bg-sowaka-primary text-white shadow-sm" 
                  : "text-sowaka-textMuted hover:bg-[#EAE4DF]"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {onAction && actionLabel && (
        <div className="p-6">
          <button 
            onClick={onAction}
            className="w-full bg-sowaka-primary hover:bg-sowaka-primaryHover text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {ActionIcon ? <ActionIcon size={18} /> : <Plus size={18} />}
            {actionLabel}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
