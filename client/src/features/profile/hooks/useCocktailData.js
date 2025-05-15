import { useState, useEffect } from 'react';

export function useCocktailData() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientCocktails, setIngredientCocktails] = useState([]);
  const [ingredientLoading, setIngredientLoading] = useState(false);

  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
      .then(res => res.json())
      .then(data => {
        setCocktails(data.drinks ? data.drinks.slice(0, 8) : []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list')
      .then(res => res.json())
      .then(data => setIngredients(data.drinks.map(item => item.strIngredient1)));
  }, []);

  useEffect(() => {
    if (!selectedIngredient) return;
    setIngredientLoading(true);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`)
      .then(res => res.json())
      .then(data => {
        setIngredientCocktails(data.drinks || []);
        setIngredientLoading(false);
      });
  }, [selectedIngredient]);

  return {
    cocktails,
    loading,
    ingredients,
    selectedIngredient,
    setSelectedIngredient,
    ingredientCocktails,
    ingredientLoading
  };
}
