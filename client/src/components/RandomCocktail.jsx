import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';

function RandomCocktail() {
  const [randomCocktail, setRandomCocktail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomCocktail = () => {
    setLoading(true);
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
      .then(res => res.json())
      .then(data => {
        setRandomCocktail(data.drinks[0]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRandomCocktail();
  }, []);

  // Modern sticker-style ingredient gallery
  const renderIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(
          <div
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 18px 18px 0',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            className="ingredient-sticker"
          >
            <img
              src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredient)}.png`}
              alt={ingredient}
              style={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                marginBottom: 8,
                borderRadius: 16,
                boxShadow: '0 2px 8px #ccc',
                background: '#fff',
                border: '1px solid #eee',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onError={e => { e.target.style.display = 'none'; }}
              className="ingredient-img"
            />
            <div style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>{ingredient}</div>
            {measure && (
              <div>
                <Badge bg="secondary" className="mt-1" style={{ fontSize: 13 }}>
                  {measure.trim()}
                </Badge>
              </div>
            )}
          </div>
        );
      }
    }
    return ingredients;
  };

  // Inline CSS for hover effect (no external CSS needed)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .ingredient-sticker:hover .ingredient-img {
        transform: scale(1.10) rotate(-2deg);
        box-shadow: 0 6px 20px #bbb;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="text-center my-4">
      {loading ? (
        <Spinner animation="border" />
      ) : randomCocktail ? (
        <Card className="mx-auto" style={{ maxWidth: 500 }}>
          <Card.Img
            variant="top"
            src={randomCocktail.strDrinkThumb}
            alt={randomCocktail.strDrink}
            style={{
              maxHeight: 320,
              maxWidth: 350,
              objectFit: 'contain',
              background: '#f8f9fa',
              margin: '0 auto',
              display: 'block',
              borderRadius: '12px'
            }}
          />
          <Card.Body>
            <Card.Title>
              {randomCocktail.strDrink}{' '}
              {randomCocktail.strAlcoholic === "Alcoholic" ? (
                <span role="img" aria-label="alcoholic">🍸</span>
              ) : (
                <span role="img" aria-label="non-alcoholic">🥤</span>
              )}
            </Card.Title>
            <div className="mb-2">
              <Badge bg="info" className="me-2">{randomCocktail.strCategory}</Badge>
              <Badge bg="secondary">{randomCocktail.strGlass}</Badge>
            </div>
            <h5>Ingredients:</h5>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '1.5rem'
              }}
            >
              {renderIngredients(randomCocktail)}
            </div>
            <h5>Instructions:</h5>
            <p>{randomCocktail.strInstructions}</p>
            <Button onClick={fetchRandomCocktail} variant="info" className="mt-2">
              Show another random cocktail
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>Could not load cocktail.</div>
      )}
    </div>
  );
}

export default RandomCocktail;
