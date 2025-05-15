import { Spinner } from 'react-bootstrap';
import CocktailList from '../components/CocktailList';

function PopularTab({ loading, cocktails, onCocktailClick, favorites, onFavoriteToggle }) {
  return (
    <>
      {/* <h3 className="text-center mb-4 mt-4">Popular cocktails</h3> */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading cocktails...</p>
        </div>
      ) : (
        <CocktailList 
          cocktails={cocktails} 
          onCocktailClick={onCocktailClick}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
    </>
  );
}

export default PopularTab;
