import { useState, useCallback } from 'react';

export function useRandomCocktail() {
    const [cocktail, setCocktail] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRandomCocktail = useCallback(() => {
        setLoading(true);
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {
            setCocktail(data.drinks ? data.drinks[0] : null);
            setLoading(false);
        })
        .catch(() => {
            setCocktail(null);
            setLoading(false);
        });
    }, []);

    return { 
        cocktail, 
        loading, 
        fetchRandomCocktail 
    };
}
