import { useState, useEffect } from 'react';

export function useFavorites(userId, token) {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const favoriteIds = await response.json();
          setFavorites(new Set(favoriteIds));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
        setFavorites(new Set(savedFavorites));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [userId, token]);

  // Save favorites to both backend and localStorage
  const toggleFavorite = async (cocktailId) => {
    try {
      const newFavorites = new Set(favorites);
      const isFavorite = newFavorites.has(cocktailId);
      
      if (isFavorite) {
        newFavorites.delete(cocktailId);
      } else {
        newFavorites.add(cocktailId);
      }
      setFavorites(newFavorites);
      
      // Save to localStorage as backup
      localStorage.setItem(`favorites_${userId}`, JSON.stringify([...newFavorites]));
      
      // Save to backend
      if (isFavorite) {
        await fetch(`/api/favorites/${cocktailId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ cocktailId })
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
      setFavorites(new Set(savedFavorites));
    }
  };

  return { favorites, toggleFavorite, loading };
}
