import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { getWeather, defaultWeatherData, WeatherData } from '../utils/weatherApi';
import { secondsInHour } from '../utils/constants';
import { formattedTempC, formattedDate } from '../utils/formatters';

import './CityCard.scss';

interface CityCardProps {
  city: string;
  onFavouriteAdd?: (city: string) => void;
  isFavourite?: boolean;
}

const CityCard = ({ city, onFavouriteAdd, isFavourite }: CityCardProps): JSX.Element => {
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultWeatherData);

  const resolvedCityName = useMemo(() => (weatherData as WeatherData).name, [weatherData]);

  const localDate = useMemo(() => {
    const timezoneOffset = weatherData.timezone / secondsInHour;

    return formattedDate(weatherData.dt, timezoneOffset);
  }, [weatherData]);
  
  const tempC = useMemo(() => formattedTempC((weatherData as WeatherData).main.temp), [weatherData]);
  const feelTempC = useMemo(() => formattedTempC((weatherData as WeatherData).main.feels_like), [weatherData]);
  const humidity = useMemo(() => Math.round((weatherData as WeatherData).main.humidity), [weatherData]);

  const description = useMemo(() => {
    const item = _.get((weatherData as WeatherData).weather, 0);

    return _.get(item, 'description', '');
  }, [weatherData]);


  const handleFavouriteAdd = () => onFavouriteAdd(city);

  useEffect(() => {
    async function fetchWeatherData() {
      if (!city) {
        return;
      }
  
      setWeatherData(await getWeather(city));
    }
    
    fetchWeatherData();
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
            <div className="flex items-center">
              <div className="CityCard__city mr2">{resolvedCityName}</div>
              <div className="CityCard__localDate">{localDate}</div>
            </div>
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
