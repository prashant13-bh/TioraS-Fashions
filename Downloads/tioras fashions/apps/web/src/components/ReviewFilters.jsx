
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReviewFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative w-full md:w-auto md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search reviews..." 
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="pl-9 bg-background rounded-xl border-border/60 w-full"
        />
      </div>

      <div className="flex flex-wrap w-full md:w-auto gap-3">
        <Select value={filters.rating} onValueChange={(v) => setFilters({ ...filters, rating: v })}>
          <SelectTrigger className="w-[110px] bg-background rounded-xl">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.verified} onValueChange={(v) => setFilters({ ...filters, verified: v })}>
          <SelectTrigger className="w-[140px] bg-background rounded-xl">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Reviews</SelectItem>
            <SelectItem value="Verified Only">Verified Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={(v) => setFilters({ ...filters, sort: v })}>
          <SelectTrigger className="w-[150px] bg-background rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="-created">Newest First</SelectItem>
            <SelectItem value="-helpful_count">Most Helpful</SelectItem>
            <SelectItem value="-rating">Highest Rated</SelectItem>
            <SelectItem value="+rating">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReviewFilters;
