
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ViewToggle = ({ mode, onChange }) => {
  return (
    <div className="hidden sm:flex items-center bg-secondary/50 rounded-md p-1 border border-border">
      <Button
        variant="ghost"
        size="icon"
        className={`h-7 w-7 rounded-sm ${mode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => onChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-7 w-7 rounded-sm ${mode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => onChange('list')}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
