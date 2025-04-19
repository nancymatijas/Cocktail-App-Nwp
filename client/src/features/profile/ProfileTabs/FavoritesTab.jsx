import React from 'react';
import CocktailList from '../components/CocktailList';

function FavoritesTab({ favorites, cocktails, ingredientCocktails, onCocktailClick, onFavoriteToggle, loading }) {
  const getFavoriteCocktails = () => {
    return [...favorites].map(id => 
      cocktails.find(c => c.idDrink === id) || 
      ingredientCocktails.find(c => c.idDrink === id)
    ).filter(Boolean);
  };

  return (
    <>
      <h3 className="text-center mb-4 mt-4">Favorite Cocktails</h3>
      {loading ? (
        <div className="text-center">
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <p>Loading favorites...</p>
        </div>
      ) : favorites.size === 0 ? (
        <p className="text-center text-muted">No favorites yet. Click the ❤️ to add some!</p>
      ) : (
        <CocktailList 
          cocktails={getFavoriteCocktails()} 
          onCocktailClick={onCocktailClick}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
    </>
  );
}

export default FavoritesTab;
