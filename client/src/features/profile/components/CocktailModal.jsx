import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import "../../../App.css"

function CocktailModal({ show, onHide, cocktail, isFavorite, onFavoriteToggle }) {
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
              className="cocktail-image"
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
          className={isFavorite ? "favorite-button-danger" : "favorite-button-outline-primary"}
          onClick={() => onFavoriteToggle(cocktail?.idDrink)}
        >
          {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CocktailModal;
