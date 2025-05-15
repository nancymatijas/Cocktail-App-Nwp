import React, { useEffect } from 'react';
import { Card, Button, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { useRandomCocktail } from '../hooks/useRandomCocktail';
import "../../../App.css";

function RandomCocktail() {
  const { cocktail, loading, fetchRandomCocktail } = useRandomCocktail();

  useEffect(() => {
    fetchRandomCocktail();
  }, [fetchRandomCocktail]);

  const renderIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(
          <Col key={i} xs={6} md={4} lg={3} className="mb-3">
            <div className="cocktail-ingredient">
              <img
                src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredient)}.png`}
                alt={ingredient}
                className="ingredient-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="ingredient-name">{ingredient}</div>
              {measure && (
                <Badge bg="secondary" className="measure-badge">
                  {measure.trim()}
                </Badge>
              )}
            </div>
          </Col>
        );
      }
    }
    return ingredients;
  };

  return (
    <div className="random-cocktail-container text-center my-4">
      {loading ? (
        <Spinner animation="border" />
      ) : cocktail ? (
        <Card className="mx-auto" style={{ maxWidth: 1500 }}>
          <Card.Body>
            <Row>
              <Col md={4} className="d-flex justify-content-center align-items-start mb-4">
                <img
                  src={cocktail.strDrinkThumb}
                  alt={cocktail.strDrink}
                  className="cocktail-image"
                />
              </Col>
              <Col md={8} className="text-start">
                <Card.Title className="cocktail-title">
                  {cocktail.strDrink}{' '}
                  {cocktail.strAlcoholic === "Alcoholic" ? (
                    <span role="img" aria-label="alcoholic">🍸</span>
                  ) : (
                    <span role="img" aria-label="non-alcoholic">🥤</span>
                  )}
                </Card.Title>
                <div className="mb-2">
                  <Badge bg="info" className="me-2">{cocktail.strCategory}</Badge>
                  <Badge bg="secondary">{cocktail.strGlass}</Badge>
                </div>
                <h5>Ingredients:</h5>
                <Row className="g-2 ingredients-container">
                  {renderIngredients(cocktail)}
                </Row>
                <h5 className="mt-4">Instructions:</h5>
                <p>{cocktail.strInstructions}</p>
                <Button onClick={fetchRandomCocktail} variant="info" className="mt-2">
                  Show another random cocktail
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <div>Could not load cocktail.</div>
      )}
    </div>
  );
}

export default RandomCocktail;
