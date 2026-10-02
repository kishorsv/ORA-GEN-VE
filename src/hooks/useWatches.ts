import { useState, useEffect, useCallback, useRef } from 'react';
import type { WatchModel, WatchFilters } from '../types/database';
import { fetchWatches, subscribeToWatches } from '../services/watches';

export function useWatches(initialFilters?: WatchFilters) {
  const [watches, setWatches] = useState<WatchModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WatchFilters>(initialFilters || {});
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleSearchChange = useCallback((query: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: query }));
    }, 280);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWatches(filters);
      setWatches(data);
    } catch (err: any) {
      console.error('Failed to load watches:', err);
      setError(err?.message || 'Unable to load the collection.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time synchronization
  useEffect(() => {
    const unsubscribe = subscribeToWatches(() => {
      loadData();
    });
    return () => {
      unsubscribe();
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [loadData]);

  return {
    watches,
    loading,
    error,
    filters,
    setFilters,
    setSearchQuery: handleSearchChange,
    refetch: loadData,
  };
}
