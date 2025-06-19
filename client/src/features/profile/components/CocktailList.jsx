import { Row, Col, Card } from 'react-bootstrap';
import "../../../App.css"

function CocktailList({ cocktails, onCocktailClick, favorites, onFavoriteToggle }) {
  return (
    <Row xs={1} sm={2} md={4} className="g-4">
      {cocktails.map(cocktail => (
        <Col key={cocktail.idDrink}>
          <Card className="h-100 cocktail-hover-card">
            <Card.Img 
              variant="top" 
              src={cocktail.strDrinkThumb} 
              onClick={() => onCocktailClick(cocktail.idDrink)}
            />
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title onClick={() => onCocktailClick(cocktail.idDrink)}>
                  {cocktail.strDrink}
                </Card.Title>
                <span
                  className="favorite-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle(cocktail.idDrink);
                  }}
                >
                  {favorites.has(cocktail.idDrink) ? '❤️' : '🤍'}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default CocktailList;
