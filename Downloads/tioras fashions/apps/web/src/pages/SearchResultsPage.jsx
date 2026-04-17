
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AdvancedFilters from '@/components/AdvancedFilters.jsx';
import ActiveFiltersBar from '@/components/ActiveFiltersBar.jsx';
import ProductGridResults from '@/components/ProductGridResults.jsx';
import SortOptions from '@/components/SortOptions.jsx';
import ViewToggle from '@/components/ViewToggle.jsx';
import NoResultsPage from '@/components/NoResultsPage.jsx';
import apiServerClient from '@/lib/apiServerClient';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Extract current filters from URL
  const currentFilters = {};
  for (const [key, value] of searchParams.entries()) {
    if (key !== 'q' && key !== 'sort' && key !== 'page') {
      currentFilters[key] = value;
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // In a real app, we'd pass all searchParams to the backend
        const queryString = searchParams.toString();
        const response = await apiServerClient.fetch(`/search/results?${queryString}`);
        
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setTotal(data.total || 0);
        } else {
          // Mock data for demonstration if backend endpoint isn't ready
          setTimeout(() => {
            if (query.toLowerCase() === 'empty') {
              setResults([]);
              setTotal(0);
            } else {
              setResults([
                { id: '1', title: 'Premium Silk Dress', price_in_cents: 450000, currency: 'INR', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', rating: 4.8, reviewCount: 124, isNew: true },
                { id: '2', title: 'Classic Cotton Shirt', price_in_cents: 250000, currency: 'INR', image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c', rating: 4.5, reviewCount: 89, salePrice: 199900 },
                { id: '3', title: 'Designer Handbag', price_in_cents: 850000, currency: 'INR', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809', rating: 4.9, reviewCount: 210 },
                { id: '4', title: 'Formal Trousers', price_in_cents: 320000, currency: 'INR', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', rating: 4.2, reviewCount: 45 }
              ]);
              setTotal(24);
            }
            setLoading(false);
          }, 800);
          return;
        }
      } catch (error) {
        console.error('Search failed', error);
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update or remove filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 on filter change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortValue) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortValue);
    setSearchParams(newParams);
  };

  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (query) newParams.set('q', query);
    if (searchParams.get('sort')) newParams.set('sort', searchParams.get('sort'));
    setSearchParams(newParams);
  };

  if (!loading && results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>No Results for "{query}" | TioraS Fashions</title>
        </Helmet>
        <Header />
        <main className="flex-grow">
          <NoResultsPage query={query} onClearFilters={clearAllFilters} hasFilters={Object.keys(currentFilters).length > 0} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Search Results for "{query}" | TioraS Fashions</title>
      </Helmet>
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Showing results for "${query}"` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            Showing 1-{Math.min(results.length, 20)} of {total} results
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <AdvancedFilters 
                currentFilters={currentFilters} 
                onFilterChange={handleFilterChange} 
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-card p-4 rounded-xl border border-border shadow-sm">
              
              {/* Mobile Filter Button */}
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                    {Object.keys(currentFilters).length > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {Object.keys(currentFilters).length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto p-0">
                  <SheetHeader className="p-6 border-b border-border sticky top-0 bg-background z-10">
                    <SheetTitle className="flex items-center">
                      <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-6">
                    <AdvancedFilters 
                      currentFilters={currentFilters} 
                      onFilterChange={(f) => { handleFilterChange(f); setIsMobileFiltersOpen(false); }} 
                      onClearAll={() => { clearAllFilters(); setIsMobileFiltersOpen(false); }}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <ActiveFiltersBar 
                filters={currentFilters} 
                onRemove={removeFilter} 
                onClearAll={clearAllFilters} 
              />

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end ml-auto">
                <ViewToggle mode={viewMode} onChange={setViewMode} />
                <SortOptions 
                  value={searchParams.get('sort') || 'relevance'} 
                  onChange={handleSortChange} 
                />
              </div>
            </div>

            {/* Results Grid/List */}
            <ProductGridResults 
              products={results} 
              loading={loading} 
              viewMode={viewMode} 
              total={total}
              currentPage={parseInt(searchParams.get('page') || '1')}
              onPageChange={(p) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', p.toString());
                setSearchParams(newParams);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
