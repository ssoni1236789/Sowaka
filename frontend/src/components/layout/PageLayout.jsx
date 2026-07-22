import React from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

const PageLayout = ({ 
  children, 
  sidebarProps, // If null, no sidebar is rendered
  topNavProps 
}) => {
  return (
    <div className="min-h-screen bg-sowaka-bg flex">
      {sidebarProps && (
        <Sidebar {...sidebarProps} />
      )}
      
      <main className={`flex-1 flex flex-col min-h-screen ${sidebarProps ? 'ml-64' : ''}`}>
        <TopNavigation {...topNavProps} showLogo={!sidebarProps} />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
