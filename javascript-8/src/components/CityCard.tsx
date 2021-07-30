import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import _ from 'lodash';
import classNames from 'classnames';

import './CityCard.scss';

interface CityCardProps {
  city: string;
  onFavouriteAdd?: (city: string) => void;
  isFavourite?: boolean;
}

interface WeatherMain {
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
}

interface WeatherCommon {
  id: number;
  main: string;
  description: string;
}

interface WeatherData {
  name: string;
  main: WeatherMain;
  weather: WeatherCommon[];
}

declare namespace CONFIG {
  const weatherApiKey: string;
};

const defaultWeatherData = { main: {} };

const weatherApiRoot = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = CONFIG.weatherApiKey;
const zeroK = 273.15;

const CityCard = ({ city, onFavouriteAdd, isFavourite }: CityCardProps): JSX.Element => {
  const [weatherData, setWeatherData] = useState(defaultWeatherData);

  const resolvedCityName = useMemo(() => (weatherData as WeatherData).name, [weatherData]);
  const tempC = useMemo(() => Math.round((weatherData as WeatherData).main.temp - zeroK), [weatherData]);
  const feelTempC = useMemo(() => Math.round((weatherData as WeatherData).main.feels_like - zeroK), [weatherData]);
  const humidity = useMemo(() => Math.round((weatherData as WeatherData).main.humidity), [weatherData]);

  const description = useMemo(() => {
    const item = _.get((weatherData as WeatherData).weather, 0);

    return _.get(item, 'description', '');
  }, [weatherData]);


  const handleFavouriteAdd = () => onFavouriteAdd(city);

  const getWeather = async () => {
    const { data } = await axios.get(weatherApiRoot, {
      params: {
        q: city,
        appid: apiKey,
        lang: 'ru',
      },
    });

    setWeatherData(data);
  };

  useEffect(() => {
    if (!city) {
      return;
    }

    getWeather();
  }, [city]);

  return (
    <div className={classNames(["CityCard", { CityCard_inactive: !resolvedCityName }])}>
      {resolvedCityName
        ? <div>
            <div
              className={classNames(["CityCard__favouriteButton", { CityCard__favouriteButton_active: isFavourite }])}
              onClick={handleFavouriteAdd}
            >
              <i className="fas fa-star"></i>
            </div>
            <div className="CityCard__city">{resolvedCityName}</div>
            <div className="CityCard__description">{description}</div>
            <div className="CityCard__temp">{tempC}℃</div>
            <div className="CityCard__feelTemp">Ощущается как {feelTempC}℃</div>
            <div className="CityCard__humidity">
              <i className="CityCard__humidityIcon fas fa-tint"></i>
              <span>{humidity}%</span>
            </div>
          </div>
        : null
      }
    </div>
  );
}


export default CityCard;
