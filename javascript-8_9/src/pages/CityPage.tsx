import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

import './CityPage.scss';

import {
  getWeather,
  getForecast,
  defaultWeatherData,
  defaultForecastData,
  WeatherData,
  ForecastData,
  ForecastItem,
} from '../utils/weatherApi';

import { secondsInHour, zeroK } from '../utils/constants';
import { formattedTempC, formattedDate } from '../utils/formatters';

interface CityPageParams {
  city: string;
}

const CityPage = (): JSX.Element => {
  const { city } = useParams<CityPageParams>();
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultWeatherData);
  const [forecastData, setForecastData] = useState<ForecastData>(defaultForecastData);

  const resolvedCityName = useMemo(() => (weatherData as WeatherData).name, [weatherData]);
  const tempC = useMemo(() => Math.round((weatherData as WeatherData).main.temp - zeroK), [weatherData]);
  const feelTempC = useMemo(() => Math.round((weatherData as WeatherData).main.feels_like - zeroK), [weatherData]);
  const humidity = useMemo(() => Math.round((weatherData as WeatherData).main.humidity), [weatherData]);
  const forecastItems = useMemo(() => forecastData.list, [forecastData]);

  const timezoneOffset = useMemo(() => _.get(forecastData, 'city.timezone', 0) / secondsInHour, [forecastData]);

  const description = useMemo(() => {
    const item = _.get((weatherData as WeatherData).weather, 0);

    return _.get(item, 'description', '');
  }, [weatherData]);

  useEffect(() => {
    async function fetchWeatherData() {
      setWeatherData(await getWeather(city));
    }

    fetchWeatherData();
  }, []);

  useEffect(() => {
    async function fetchForecastData() {
      setForecastData(await getForecast(city));
    }

    fetchForecastData();
  }, []);

  const getDescription = (item: ForecastItem): string => _.get(item, 'weather.0.description');

  return (<div className="CityPage">
    {weatherData.name
    ? <>
      <div className="flex justify-center items-center mb2">
        <div className="CityPage__city mr2">{resolvedCityName}</div>
        <div className="CityPage__temp mr2">{tempC}℃</div>
        <div className="CityPage__feelTemp">Ощущается как {feelTempC}℃</div>
      </div>
      <div className="flex justify-center mb3">
        <div className="CityPage__description mr2">{description}</div>
        <div className="CityPage__humidity">
          <i className="CityPage__humidityIcon fas fa-tint"></i>
          <span>{humidity}%</span>
        </div>
      </div>
      <h2 className="tc">Прогноз погоды на 5 дней</h2>
      <div className="flex justify-center">
        <table className="w-100 CityPage__forecastTable">
          <tr>
            <th className="CityPage__firstColum">Дата</th>
            <th>Температура</th>
            <th>Погода</th>
            <th>Влажность</th>
          </tr>
          {forecastItems.map(item =>
            <tr key={item.dt}>
              <td>{formattedDate(item.dt, timezoneOffset)}</td>
              <td>{formattedTempC(item.main.temp)}℃</td>
              <td>{getDescription(item)}</td>
              <td>{Math.round(item.main.humidity)}%</td>
            </tr>
          )}
        </table>
      </div>
    </>
    : <div>Загрузка...</div>
    }
  </div>);
};

export default CityPage;
