import { useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaStar, FaGlassMartiniAlt, FaHeart, FaRandom } from 'react-icons/fa';
import ProfileNavbar from './ProfileNavbar';
import ProfileCard from './ProfileCard';
import CocktailModal from './components/CocktailModal';
import { useFavorites } from './hooks/useFavorites';
import { useCocktailData } from './hooks/useCocktailData';
import SearchTab from './ProfileTabs/SearchTab';
import PopularTab from './ProfileTabs/PopularTab';
import IngredientsTab from './ProfileTabs/IngredientsTab';
import FavoritesTab from './ProfileTabs/FavoritesTab';
import RandomTab from './ProfileTabs/RandomTab';

function Profile({ user, onLogout }) {
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites(user?.id, user?.token);
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
      <Container className="mt-4 profile-container">
        <Row className="justify-content-center profile-card-wrapper">
          <Col xs={12} md={8} lg={6}>
            <ProfileCard user={user} />
          </Col>
        </Row>
        <Tabs defaultActiveKey="search" className="custom-tabs mb-4" fill>
          <Tab eventKey="search" title={<><FaSearch className="me-2" />Search</>}>
            <div className="tab-content">
              <SearchTab 
                onCocktailClick={handleCocktailClick}
                favorites={favorites}
                onFavoriteToggle={toggleFavorite} 
              />
            </div>
          </Tab>
          <Tab eventKey="popular" title={<><FaStar className="me-2" />Popular</>}>
            <div className="tab-content">
              <PopularTab 
                loading={loading}
                cocktails={cocktails}
                onCocktailClick={handleCocktailClick}
                favorites={favorites}
                onFavoriteToggle={toggleFavorite}
              />
            </div>
          </Tab>
          <Tab eventKey="ingredients" title={<><FaGlassMartiniAlt className="me-2" />By Alcohol Type</>}>
            <div className="tab-content">
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
            </div>
          </Tab>
          <Tab eventKey="favorites" title={<><FaHeart className="me-2" />Favorites</>}>
            <div className="tab-content">
              <FavoritesTab
                favorites={favorites}
                cocktails={cocktails}
                ingredientCocktails={ingredientCocktails}
                onCocktailClick={handleCocktailClick}
                onFavoriteToggle={toggleFavorite}
                loading={favoritesLoading}
              />
            </div>
          </Tab>
          <Tab eventKey="random" title={<><FaRandom className="me-2" />Random Cocktail</>}>
            <div className="tab-content">
              <RandomTab />
            </div>
          </Tab>
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