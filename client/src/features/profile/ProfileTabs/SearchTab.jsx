import React from 'react';
import CocktailSearch from '../components/CocktailSearch';

function SearchTab({ onCocktailClick }) {
  return <CocktailSearch onCocktailClick={onCocktailClick} />;
}

export default SearchTab;
