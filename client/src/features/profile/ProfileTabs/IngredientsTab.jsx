import React, { useEffect, useRef } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import CocktailList from '../components/CocktailList';
import "../../../App.css"

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
  const scrollRef = useRef(null);

  useEffect(() => {
    if (selectedIngredient && scrollRef.current) {
      scrollRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedIngredient, ingredientCocktails]);

  return (
    <div className="my-4">
      {/* <h3 className="text-center mb-4">Browse by Alcohol Type</h3> */}
      <div className="ingredient-gallery">
        {ingredients.slice(0, 30).map(ingredient => (
          <div
            key={ingredient}
            className={`ingredient-tile${selectedIngredient === ingredient ? ' selected' : ''}`}
            onClick={() => onSelectIngredient(ingredient)}
            title={ingredient}
          >
            <img
              src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.replace(/ /g, '%20')}-Medium.png`}
              alt={ingredient}
              className="ingredient-img-lg"
              onError={e => { 
                e.target.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient.replace(/ /g, '%20')}-small.png`;
              }}
            />
            <div className="ingredient-overlay">{ingredient}</div>
          </div>
        ))}
      </div>
      {selectedIngredient && (
        <div ref={scrollRef} className="mt-4">
          <h4 className="text-center mb-3">
            Cocktails with <span style={{ color: '#007bff' }}>{selectedIngredient}</span>
          </h4>
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
