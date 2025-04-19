import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Spinner, InputGroup, Button } from 'react-bootstrap';

function CocktailSearch({ onCocktailClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCocktails = (term) => {
    if (!term) {
      setCocktails([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        setCocktails(data.drinks || []);
        setLoading(false);
      })
      .catch(() => {
        setCocktails([]);
        setLoading(false);
      });
  };

  // Debounce za real-time search
  useEffect(() => {
    if (!searchTerm) {
      setCocktails([]);
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      fetchCocktails(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // OnSubmit za Enter
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCocktails(searchTerm);
  };

  return (
    <div className="my-4">
      <Form onSubmit={handleSearch}>
        <Row className="align-items-center">
          <Col xs={12} sm={10}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search cocktails by name (e.g. Margarita)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs={12} sm={2} className="mt-2 mt-sm-0">
            <Button type="submit" variant="primary" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}
      <Row className="mt-4" xs={1} sm={2} md={3} lg={4} >
        {cocktails.map(cocktail => (
          <Col key={cocktail.idDrink} className="mb-4">
            <Card
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
      {!loading && cocktails.length === 0 && searchTerm && (
        <div className="text-center mt-3 text-muted">No cocktails found.</div>
      )}
    </div>
  );
}

export default CocktailSearch;
