
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SortOptions = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline-block">Sort by:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[160px] h-9 bg-background border-border">
          <SelectValue placeholder="Relevance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="best_sellers">Best Sellers</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortOptions;
