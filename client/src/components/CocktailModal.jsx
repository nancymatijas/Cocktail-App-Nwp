import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';

function CocktailModal({ show, onHide, cocktail, isFavorite, onFavoriteToggle }) {
  const renderIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(
          <Col key={i} xs={6} md={4} lg={3} className="mb-3">
            <div style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 16,
              padding: 12,
              textAlign: 'center',
              boxShadow: '0 2px 8px #eee',
              transition: 'transform 0.2s'
            }}>
              <img
                src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredient)}.png`}
                alt={ingredient}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'contain',
                  marginBottom: 8,
                  borderRadius: '50%',
                  border: '1px solid #ddd'
                }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="fw-bold" style={{ fontSize: 14 }}>{ingredient}</div>
              {measure && (
                <Badge bg="secondary" className="mt-1" style={{ fontSize: 12 }}>
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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{cocktail?.strDrink}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img
              src={cocktail?.strDrinkThumb}
              alt={cocktail?.strDrink}
              style={{
                width: '100%',
                borderRadius: 12,
                boxShadow: '0 4px 12px #ddd'
              }}
            />
          </Col>
          <Col md={8}>
            <h5>Ingredients:</h5>
            <Row className="g-2">
              {cocktail && renderIngredients(cocktail)}
            </Row>

            <h5 className="mt-4">Instructions:</h5>
            <p>{cocktail?.strInstructions}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant={isFavorite ? "danger" : "outline-primary"} 
          onClick={() => onFavoriteToggle(cocktail?.idDrink)}
        >
          {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </Button>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CocktailModal;
