import { useState, useEffect, useCallback } from 'react';

export function useFavorites(userId, token) {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async (signal) => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/favorites', {
        signal,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const ids = await res.json();
        setFavorites(new Set(ids));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching favorites:', error);
        const saved = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
        setFavorites(new Set(saved));
      }
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchFavorites(abortController.signal);
    return () => abortController.abort();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (cocktailId) => {
    if (!token) return;
    setFavorites(prev => {
      const newFavs = new Set(prev);
      const isFav = newFavs.has(cocktailId);
      isFav ? newFavs.delete(cocktailId) : newFavs.add(cocktailId);
      if (userId) {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify([...newFavs]));
      }
      return newFavs;
    });

    const isCurrentlyFavorite = favorites.has(cocktailId);
    const url = `/api/favorites${isCurrentlyFavorite ? `/${cocktailId}` : ''}`;
    await fetch(url, {
      method: isCurrentlyFavorite ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: isCurrentlyFavorite ? null : JSON.stringify({ cocktailId })
    });
  }, [favorites, token, userId]);

  return { 
    favorites, 
    toggleFavorite, 
    loading 
  };
}
