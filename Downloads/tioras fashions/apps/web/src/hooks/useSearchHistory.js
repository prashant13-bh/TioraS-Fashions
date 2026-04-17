
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const HISTORY_KEY = 'tioras_search_history';
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const { isAuthenticated, currentUser } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (isAuthenticated && currentUser) {
        try {
          const records = await pb.collection('searchAnalytics').getList(1, MAX_HISTORY, {
            filter: `userId = "${currentUser.id}"`,
            sort: '-timestamp',
            $autoCancel: false
          });
          // Extract unique queries
          const uniqueQueries = [...new Set(records.items.map(r => r.searchQuery))].slice(0, MAX_HISTORY);
          setHistory(uniqueQueries);
        } catch (error) {
          console.error('Failed to load search history from DB', error);
          loadLocalHistory();
        }
      } else {
        loadLocalHistory();
      }
    };

    loadHistory();
  }, [isAuthenticated, currentUser]);

  const loadLocalHistory = () => {
    try {
      const local = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
      setHistory(local);
    } catch (e) {
      setHistory([]);
    }
  };

  const addSearch = async (query) => {
    if (!query || query.trim().length < 2) return;
    
    const trimmedQuery = query.trim();
    const newHistory = [trimmedQuery, ...history.filter(q => q !== trimmedQuery)].slice(0, MAX_HISTORY);
    
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

    if (isAuthenticated && currentUser) {
      try {
        await pb.collection('searchAnalytics').create({
          searchQuery: trimmedQuery,
          userId: currentUser.id,
          timestamp: new Date().toISOString(),
        }, { $autoCancel: false });
      } catch (error) {
        console.error('Failed to save search analytics', error);
      }
    }
  };

  const removeSearch = (query) => {
    const newHistory = history.filter(q => q !== query);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return { history, addSearch, removeSearch, clearHistory };
}
