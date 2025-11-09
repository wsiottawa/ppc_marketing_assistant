import React from 'react';

// Sidebar component is now deprecated in favor of the mega menu system in Header
// This component is kept for backward compatibility but renders nothing
// All navigation has been moved to the Header mega menu system

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  // Return null to effectively remove the sidebar from the layout
  // All navigation functionality has been moved to the Header component
  return null;
};

export default Sidebar;