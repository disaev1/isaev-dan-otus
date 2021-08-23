import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/js/all.js';
import './App.scss';

import CityCard from './components/CityCard';
import CitySelector from './components/CitySelector';


const App = (): JSX.Element => {
  const [favourites, setFavourites] = useState([]);
  const [currentCity, setCurrentCity] = useState(null);

  const handleCitySelect = (city: string): void => {
    setCurrentCity(city);
  }

  const handleFavouriteToggle = (city: string): void => {
    if (favourites.includes(city)) {
      setFavourites(favourites.filter(item => item !== city));
    } else {
      setFavourites([...favourites, city]);
    }
  }

  return (
    <div className="App">
      <h1>Узнайте текущую погоду</h1>
      <div className="App__top">
        <div className="mr2">
          <CitySelector onSelect={handleCitySelect} />
        </div>
        {currentCity
          ? <CityCard
              city={currentCity}
              isFavourite={favourites.includes(currentCity)}
              onFavouriteAdd={handleFavouriteToggle}
            />
          : <div className="App__cityCardPlaceholder">Выберите город</div>
        }
      </div>
      <div className="App__cardsContainer">
        {favourites.map((city) =>
          <div className="ma1">
            <div className="mb2 tc">{city}</div>
            <CityCard
              key={city}
              city={city}
              isFavourite={favourites.includes(city)}
              onFavouriteAdd={handleFavouriteToggle}
            />
          </div>
        )}
      </div>
    </div>
  ); 
};

export default App;
