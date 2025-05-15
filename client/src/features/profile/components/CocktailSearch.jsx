import React, { useState, useEffect } from 'react';
import { Form, Spinner, InputGroup, Button } from 'react-bootstrap';
import CocktailList from './CocktailList';

function CocktailSearch({ onCocktailClick, favorites = new Set(), onFavoriteToggle }) {
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCocktails(searchTerm);
  };

  return (
  <div>
    <Form onSubmit={handleSearch} className="mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search cocktails by name (e.g. Margarita)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </InputGroup>
    </Form>

    {loading && (
      <div className="text-center my-3">
        <Spinner animation="border" />
      </div>
    )}

    {!loading && cocktails.length > 0 && (
      <CocktailList
        cocktails={cocktails}
        onCocktailClick={onCocktailClick}
        favorites={favorites}
        onFavoriteToggle={onFavoriteToggle}
      />
    )}

    {!loading && cocktails.length === 0 && searchTerm && (
      <div className="text-center mt-3 text-muted">No cocktails found.</div>
    )}
  </div>

  );
}

export default CocktailSearch;
