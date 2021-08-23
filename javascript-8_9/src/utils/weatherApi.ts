import axios from 'axios';

declare namespace CONFIG {
  const weatherApiKey: string;
};

const weatherApiRoot = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiRoot = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = CONFIG.weatherApiKey;

interface WeatherMain {
  temp?: number;
  feels_like?: number;
  pressure?: number;
  humidity?: number;
}

interface WeatherCommon {
  id: number;
  main: string;
  description: string;
}

interface WeatherData {
  name?: string;
  main?: WeatherMain;
  weather?: WeatherCommon[];
  dt?: number;
  timezone?: number;
}

interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city?: CityData;
}

interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCommon[];
}

interface CityData {
  timezone: number;
}

const defaultWeatherData: WeatherData = { main: {} };
const defaultForecastData: ForecastData = { cod: '200', message: 0, cnt: 0, list: [] };


const getWeather = async (city: string): Promise<WeatherData> => {
  const { data } = await axios.get(weatherApiRoot, {
    params: {
      q: city,
      appid: apiKey,
      lang: 'ru',
    },
  });

  return data;
};

const getForecast = async (city: string): Promise<ForecastData> => {
  const { data } = await axios.get(forecastApiRoot, {
    params: {
      q: city,
      appid: apiKey,
      lang: 'ru',
    },
  });

  return data;
};

export { getWeather, getForecast, defaultWeatherData, defaultForecastData, WeatherData, ForecastData, ForecastItem };
