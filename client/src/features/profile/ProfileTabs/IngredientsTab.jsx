import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import CocktailList from '../components/CocktailList';

function IngredientsTab({ 
  ingredients, 
  selectedIngredient, 
  onSelectIngredient, 
  ingredientCocktails, 
  ingredientLoading, 
  onCocktailClick, 
  favorites, 
  onFavoriteToggle 
}) {
  return (
    <div className="my-4">
      <h3 className="text-center mb-4">Browse by Alcohol Type</h3>
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        {ingredients.slice(0, 30).map(ingredient => (
          <Button
            key={ingredient}
            variant={selectedIngredient === ingredient ? 'primary' : 'outline-primary'}
            onClick={() => onSelectIngredient(ingredient)}
          >
            {ingredient}
          </Button>
        ))}
      </div>
      {selectedIngredient && (
        <div className="mt-4">
          <h4 className="text-center mb-3">Cocktails with {selectedIngredient}</h4>
          {ingredientLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <CocktailList 
                cocktails={ingredientCocktails} 
                onCocktailClick={onCocktailClick}
                favorites={favorites}
                onFavoriteToggle={onFavoriteToggle}
              />
              <div className="text-center mt-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => onSelectIngredient(null)}
                >
                  Clear Filter
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default IngredientsTab;
