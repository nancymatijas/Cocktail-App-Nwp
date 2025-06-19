import { useEffect, useState } from 'react';
import CocktailList from '../components/CocktailList';

function FavoritesTab({ favorites, cocktails, ingredientCocktails, onCocktailClick, onFavoriteToggle }) {
  const [extraCocktails, setExtraCocktails] = useState([]);

  useEffect(() => {
    const missingIds = [...favorites].filter(
      id =>
        !cocktails.some(c => c.idDrink === id) &&
        !ingredientCocktails.some(c => c.idDrink === id)
    );

    Promise.all(
      missingIds.map(id =>
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
          .then(res => res.json())
          .then(data => data.drinks ? data.drinks[0] : null)
      )
    ).then(results => setExtraCocktails(results.filter(Boolean)));
  }, [favorites, cocktails, ingredientCocktails]);

  const getFavoriteCocktails = () => {
    const localFavs = [...favorites]
      .map(id =>
        cocktails.find(c => c.idDrink === id) ||
        ingredientCocktails.find(c => c.idDrink === id)
      )
      .filter(Boolean);
    return [...localFavs, ...extraCocktails];
  };

  return (
    <>
      {/* <h3 className="text-center mb-4 mt-4">Favorite Cocktails</h3> */}
      {favorites.size === 0 ? (
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
