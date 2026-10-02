import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'ora_favorites_v2';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read favorites', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Could not save favorites', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((watchId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(watchId)) {
        return prev.filter((id) => id !== watchId);
      } else {
        return [...prev, watchId];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (watchId: string) => favoriteIds.includes(watchId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    toggleFavorite,
    isFavorite,
  };
}
