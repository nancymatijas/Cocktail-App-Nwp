import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Tabs, Tab } from 'react-bootstrap';
import ProfileNavbar from './ProfileNavbar';
import ProfileCard from './ProfileCard';
import CocktailSearch from './CocktailSearch';
import CocktailList from './CocktailList';
import CocktailModal from './CocktailModal';
import AdminProfile from './AdminProfile';
import RandomCocktail from './RandomCocktail'; // <--- Dodaj ovaj import

function Profile({ user, onLogout }) {
  // Popular cocktails
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for cocktail details
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Alcohol ingredients
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientCocktails, setIngredientCocktails] = useState([]);
  const [ingredientLoading, setIngredientLoading] = useState(false);

  // Fetch popular cocktails
  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
      .then(res => res.json())
      .then(data => {
        setCocktails(data.drinks ? data.drinks.slice(0, 8) : []);
        setLoading(false);
      });
  }, []);

  // Fetch all ingredients
  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list')
      .then(res => res.json())
      .then(data => setIngredients(data.drinks.map(item => item.strIngredient1)));
  }, []);

  // Fetch cocktails for selected ingredient
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

  // Open cocktail details modal
  const handleCocktailClick = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.drinks?.length > 0) {
          setSelectedCocktail(data.drinks[0]);
          setShowModal(true);
        }
      });
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCocktail(null);
  };

  return (
    <>
      <ProfileNavbar user={user} onLogout={onLogout} />

      <Container className="mt-4">
        {/* Profile card at the top */}
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <ProfileCard user={user} />
          </Col>
        </Row>

        {/* TABS for main content */}
        <Tabs defaultActiveKey="search" className="mb-4 justify-content-center" fill>
          {/* Search Tab */}
          <Tab eventKey="search" title="Search">
            <CocktailSearch onCocktailClick={handleCocktailClick} />
          </Tab>
          {/* Popular Cocktails Tab */}
          <Tab eventKey="popular" title="Popular">
            <h3 className="text-center mb-4 mt-4">Popular cocktails</h3>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
                <p>Loading cocktails...</p>
              </div>
            ) : (
              <CocktailList cocktails={cocktails} onCocktailClick={handleCocktailClick} />
            )}
          </Tab>
          {/* By Alcohol Type Tab */}
          <Tab eventKey="ingredients" title="By Alcohol Type">
            <div className="my-4">
              <h3 className="text-center mb-4">Browse by Alcohol Type</h3>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {ingredients.slice(0, 30).map(ingredient => (
                  <Button
                    key={ingredient}
                    variant={selectedIngredient === ingredient ? 'primary' : 'outline-primary'}
                    onClick={() => setSelectedIngredient(ingredient)}
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
              {selectedIngredient && (
                <div className="mt-4">
                  <h4 className="text-center mb-3">Cocktails with {selectedIngredient}</h4>
                  {ingredientLoading ? (
                    <div className="text-center">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <>
                      <CocktailList 
                        cocktails={ingredientCocktails} 
                        onCocktailClick={handleCocktailClick} 
                      />
                      <div className="text-center mt-3">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setSelectedIngredient(null)}
                        >
                          Clear Filter
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </Tab>
          {/* Random Cocktail Tab */}
          <Tab eventKey="random" title="Random Cocktail">
            <RandomCocktail />
          </Tab>
          {/* Admin Tab (only for admin) */}
          {user.role === 'admin' && (
            <Tab eventKey="admin" title="Admin">
              <AdminProfile token={user.token} />
            </Tab>
          )}
        </Tabs>

        {/* Modal for cocktail details */}
        <CocktailModal
          show={showModal}
          onHide={handleCloseModal}
          cocktail={selectedCocktail}
        />
      </Container>
    </>
  );
}

export default Profile;
