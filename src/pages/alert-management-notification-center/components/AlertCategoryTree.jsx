import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AlertCategoryTree = ({ categories, selectedCategory, onCategorySelect, alertCounts }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['performance', 'budget']));

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded?.has(categoryId)) {
      newExpanded?.delete(categoryId);
    } else {
      newExpanded?.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories?.has(category?.id);
    const isSelected = selectedCategory === category?.id;
    const hasChildren = category?.children && category?.children?.length > 0;
    const totalCount = alertCounts?.[category?.id] || 0;

    return (
      <div key={category?.id} className="select-none">
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer nav-transition ${
            isSelected 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-foreground'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleCategory(category?.id);
            }
            onCategorySelect(category?.id);
          }}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {hasChildren && (
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={14}
                className="flex-shrink-0"
              />
            )}
            <Icon 
              name={category?.icon} 
              size={16} 
              className={`flex-shrink-0 ${getSeverityColor(category?.severity)}`}
            />
            <span className="text-sm font-medium truncate">{category?.name}</span>
          </div>
          
          {totalCount > 0 && (
            <div className="flex items-center space-x-1">
              <span className={`inline-flex items-center justify-center min-w-5 h-5 text-xs font-medium rounded-full px-1.5 ${
                isSelected 
                  ? 'bg-primary-foreground text-primary' 
                  : `${getSeverityBg(category?.severity)} text-white`
              }`}>
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category?.children?.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Alert Categories</h2>
        <p className="text-sm text-muted-foreground mt-1">Monitor campaign performance</p>
      </div>
      <div className="p-3 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
        {categories?.map(category => renderCategory(category))}
      </div>
    </div>
  );
};

export default AlertCategoryTree;