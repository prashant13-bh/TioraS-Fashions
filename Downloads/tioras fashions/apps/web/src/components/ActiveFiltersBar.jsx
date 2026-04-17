
import React from 'react';
import { X } from 'lucide-react';

const ActiveFiltersBar = ({ filters, onRemove, onClearAll }) => {
  const activeKeys = Object.keys(filters);
  
  if (activeKeys.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 flex-grow">
      <span className="text-sm text-muted-foreground mr-2">Active Filters:</span>
      
      {activeKeys.map(key => {
        const values = filters[key].split(',');
        return values.map(val => (
          <span 
            key={`${key}-${val}`} 
            className="inline-flex items-center bg-secondary text-secondary-foreground text-xs px-3 py-1.5 rounded-full"
          >
            <span className="capitalize mr-1 font-medium">{key}:</span> {val}
            <button 
              onClick={() => {
                // If multiple values, remove just this one, else remove key
                if (values.length > 1) {
                  const newVals = values.filter(v => v !== val).join(',');
                  onRemove(key, newVals); // Needs slight adjustment in parent to handle partial removal, but for simplicity we'll just pass key
                } else {
                  onRemove(key);
                }
              }}
              className="ml-2 hover:text-destructive focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ));
      })}
      
      <button 
        onClick={onClearAll}
        className="text-xs text-primary hover:underline ml-2 font-medium"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFiltersBar;
