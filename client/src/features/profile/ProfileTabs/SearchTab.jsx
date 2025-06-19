import CocktailSearch from '../components/CocktailSearch';

function SearchTab({ onCocktailClick, favorites, onFavoriteToggle }) {
  return (
    <CocktailSearch
      onCocktailClick={onCocktailClick}
      favorites={favorites}
      onFavoriteToggle={onFavoriteToggle}
    />
  );
}

export default SearchTab;
