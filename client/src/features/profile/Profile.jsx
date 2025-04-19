import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import ProfileNavbar from './ProfileNavbar';
import ProfileCard from './ProfileCard';
import CocktailModal from './components/CocktailModal';

// Custom Hooks
import { useFavorites } from './hooks/useFavorites';
import { useCocktailData } from './hooks/useCocktailData';

// Tab Components
import SearchTab from './ProfileTabs/SearchTab';
import PopularTab from './ProfileTabs/PopularTab';
import IngredientsTab from './ProfileTabs/IngredientsTab';
import FavoritesTab from './ProfileTabs/FavoritesTab';
import RandomTab from './ProfileTabs/RandomTab';
import AdminTab from './ProfileTabs/AdminTab';

function Profile({ user, onLogout }) {
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites(user.id, user.token);
  const {
    cocktails,
    loading,
    ingredients,
    selectedIngredient,
    setSelectedIngredient,
    ingredientCocktails,
    ingredientLoading
  } = useCocktailData();

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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCocktail(null);
  };

  return (
    <>
      <ProfileNavbar user={user} onLogout={onLogout} />

      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <ProfileCard user={user} />
          </Col>
        </Row>

        <Tabs defaultActiveKey="search" className="mb-4 justify-content-center" fill>
          <Tab eventKey="search" title="Search">
            <SearchTab onCocktailClick={handleCocktailClick} />
          </Tab>

          <Tab eventKey="popular" title="Popular">
            <PopularTab 
              loading={loading}
              cocktails={cocktails}
              onCocktailClick={handleCocktailClick}
              favorites={favorites}
              onFavoriteToggle={toggleFavorite}
            />
          </Tab>

          <Tab eventKey="ingredients" title="By Alcohol Type">
            <IngredientsTab
              ingredients={ingredients}
              selectedIngredient={selectedIngredient}
              onSelectIngredient={setSelectedIngredient}
              ingredientCocktails={ingredientCocktails}
              ingredientLoading={ingredientLoading}
              onCocktailClick={handleCocktailClick}
              favorites={favorites}
              onFavoriteToggle={toggleFavorite}
            />
          </Tab>

          <Tab eventKey="favorites" title="Favorites">
          <FavoritesTab
            favorites={favorites}
            cocktails={cocktails}
            ingredientCocktails={ingredientCocktails}
            onCocktailClick={handleCocktailClick}
            onFavoriteToggle={toggleFavorite}
            loading={favoritesLoading}
          />
          </Tab>

          <Tab eventKey="random" title="Random Cocktail">
            <RandomTab />
          </Tab>

          {user.role === 'admin' && (
            <Tab eventKey="admin" title="Admin">
              <AdminTab token={user.token} />
            </Tab>
          )}
        </Tabs>

        <CocktailModal
          show={showModal}
          onHide={handleCloseModal}
          cocktail={selectedCocktail}
          isFavorite={favorites.has(selectedCocktail?.idDrink)}
          onFavoriteToggle={toggleFavorite}
        />
      </Container>
    </>
  );
}

export default Profile;
