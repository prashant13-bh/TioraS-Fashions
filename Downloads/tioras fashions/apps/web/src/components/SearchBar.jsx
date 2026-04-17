
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce.js';
import { useSearchHistory } from '@/hooks/useSearchHistory.js';
import SearchSuggestions from './SearchSuggestions.jsx';
import TrendingSearches from './TrendingSearches.jsx';
import apiServerClient from '@/lib/apiServerClient';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  
  const debouncedQuery = useDebounce(query, 300);
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions(null);
        return;
      }
      
      setLoading(true);
      try {
        const response = await apiServerClient.fetch(`/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
        // Mock fallback for UI demonstration
        setSuggestions({
          products: [
            { id: '1', title: 'Premium Silk Dress', price_in_cents: 450000, currency: 'INR', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8' }
          ],
          categories: [{ name: 'Dresses', count: 120 }],
          brands: [{ name: 'TioraS Exclusive', count: 45 }]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      addSearch(query);
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (term) => {
    setQuery(term);
    addSearch(term);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl z-50">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products, brands, styles..."
            className="w-full pl-10 pr-10 h-11 rounded-full bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-all"
            maxLength={100}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions(null);
                document.querySelector('input[type="text"]')?.focus();
              }}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-premium border border-border overflow-hidden">
          {query.length < 2 ? (
            <div className="py-2">
              {history.length > 0 && (
                <div className="mb-2 border-b border-border pb-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Recent Searches</h4>
                    <button onClick={clearHistory} className="text-xs text-primary hover:underline">Clear all</button>
                  </div>
                  <ul className="space-y-1">
                    {history.map((term, idx) => (
                      <li key={idx} className="flex items-center justify-between px-4 py-1.5 hover:bg-muted/50 group">
                        <button 
                          onClick={() => handleSelect(term)}
                          className="flex items-center text-sm text-foreground flex-grow text-left"
                        >
                          <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                          {term}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeSearch(term); }}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <TrendingSearches onSelect={handleSelect} />
            </div>
          ) : (
            <SearchSuggestions 
              query={query} 
              suggestions={suggestions} 
              loading={loading} 
              onSelect={handleSelect}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
