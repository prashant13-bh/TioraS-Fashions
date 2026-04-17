
import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient';

const TrendingSearches = ({ onSelect }) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await apiServerClient.fetch('/search/trending');
        if (response.ok) {
          const data = await response.json();
          setTrends(data.trends || []);
        }
      } catch (error) {
        console.error('Failed to fetch trending searches', error);
        // Fallback data
        setTrends(['Summer Dresses', 'Silk Sarees', 'Men Formal Shirts', 'Wedding Collection', 'Accessories']);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading || trends.length === 0) return null;

  return (
    <div className="py-3">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center px-4">
        <TrendingUp className="w-4 h-4 mr-2" /> Trending Now
      </h4>
      <div className="flex flex-wrap gap-2 px-4">
        {trends.map((term, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(term)}
            className="text-sm bg-muted hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-full transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;
