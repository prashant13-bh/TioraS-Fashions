
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NoResultsPage = ({ query, onClearFilters, hasFilters }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
        <SearchX className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
        No products found
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
        We couldn't find any matches for "{query}". Try adjusting your search or filters to find what you're looking for.
      </p>

      <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-auto mb-10 text-left shadow-sm">
        <h3 className="font-semibold mb-3">Search Suggestions:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside pl-4">
          <li>Check your spelling for typos</li>
          <li>Try using more generic keywords</li>
          <li>Try searching by category or brand</li>
          {hasFilters && <li>Try removing some active filters</li>}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {hasFilters && (
          <Button onClick={onClearFilters} variant="outline" className="w-full sm:w-auto">
            <RefreshCcw className="w-4 h-4 mr-2" /> Clear All Filters
          </Button>
        )}
        <Link to="/products" className="w-full sm:w-auto">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Browse All Products
          </Button>
        </Link>
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="ghost" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NoResultsPage;
