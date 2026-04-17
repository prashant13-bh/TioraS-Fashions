
import { useState, useMemo } from 'react';

export function useBlogFilters(posts = []) {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.author?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedDate || b.created) - new Date(a.publishedDate || a.created);
        case 'oldest':
          return new Date(a.publishedDate || a.created) - new Date(b.publishedDate || a.created);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, category, sortBy, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, page, limit]);

  const totalPages = Math.ceil(filteredPosts.length / limit);

  const resetFilters = () => {
    setCategory('all');
    setSortBy('newest');
    setSearchQuery('');
    setPage(1);
    setLimit(9);
  };

  return {
    filters: {
      category,
      searchQuery,
      sortBy,
      page,
      limit
    },
    filteredPosts,
    paginatedPosts,
    totalPages,
    totalResults: filteredPosts.length,
    setCategory,
    setSearchQuery,
    setSortBy,
    setPage,
    setLimit,
    resetFilters
  };
}
