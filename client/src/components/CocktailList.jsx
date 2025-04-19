import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

function CocktailList({ cocktails, onCocktailClick }) {
  return (
    <Row xs={1} sm={2} md={4} className="g-4">
      {cocktails.map(cocktail => (
        <Col key={cocktail.idDrink}>
          <Card
            className="h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => onCocktailClick(cocktail.idDrink)}
          >
            <Card.Img variant="top" src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            <Card.Body>
              <Card.Title>{cocktail.strDrink}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default CocktailList;
