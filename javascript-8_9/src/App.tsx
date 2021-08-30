import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';
import './App.scss';

import CityCard from './components/CityCard';
import CitySelector from './components/CitySelector';
import CityPage from './pages/CityPage';

declare namespace CONFIG {
  const localStorageAppPrefix: string;
};

const localStorageAppPrefix = CONFIG.localStorageAppPrefix;

const getSavedFavourites = (): string[] => {
  const saved = localStorage.getItem(`${localStorageAppPrefix}.favourites`);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
};

const saveFavorites = (favourites: string[]) => {
  return localStorage.setItem(`${localStorageAppPrefix}.favourites`, JSON.stringify(favourites));

}

const App = (): JSX.Element => {
  const [favourites, setFavourites] = useState([]);
  const [currentCity, setCurrentCity] = useState(null);

  useEffect(() => {
    setFavourites(getSavedFavourites());
  }, []);

  const handleCitySelect = (city: string): void => {
    setCurrentCity(city);
  }

  const handleFavouriteToggle = (city: string): void => {
    let newFavourites;
    
    if (favourites.includes(city)) {
      newFavourites = favourites.filter(item => item !== city);
    } else {
      newFavourites = [...favourites, city];
    }

    setFavourites(newFavourites);
    saveFavorites(newFavourites);
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <h1>Узнайте текущую погоду</h1>
            <div className="App__top">
              <div className="mr2">
                <CitySelector onSelect={handleCitySelect} />
              </div>
              {currentCity
                ? <Link to={`/${currentCity}`} className="App__pageLink">
                    <CityCard
                      city={currentCity}
                      isFavourite={favourites.includes(currentCity)}
                      onFavouriteAdd={handleFavouriteToggle}
                    />
                  </Link>
                : <div className="App__cityCardPlaceholder">Выберите город</div>
              }
            </div>
            <div className="App__cardsContainer">
              {favourites.map((city) =>
                <div className="ma1">
                  <div className="mb2 tc">{city}</div>
                  <Link to={`/${city}`} className="App__pageLink">
                    <CityCard
                      key={city}
                      city={city}
                      isFavourite={favourites.includes(city)}
                      onFavouriteAdd={handleFavouriteToggle}
                    />
                  </Link>
                </div>
              )}
            </div>
          </Route>
          <Route path="/:city" exact>
            <CityPage />
          </Route>
        </Switch>
      </Router>
    </div>
  ); 
};

export default App;
