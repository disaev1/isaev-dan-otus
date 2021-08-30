import React, {
  FormEventHandler,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';

import axios from 'axios';
import _ from 'lodash';
import classNames from 'classnames';

import './CitySelector.scss';

const citiesApiRoot = 'https://public.opendatasoft.com/api/records/1.0/search';

interface CityFields {
  name: string;
}

interface CityRecord {
  fields: CityFields;
  recordid: string;
}

interface IdAndName {
  id: string;
  name: string;
}

interface CitySelectorProps {
  availableCitiesPerPage?: number;
  onSelect?: (city: string) => void;
}

interface CitiesApiParams {
  start: number;
}

interface CitiesApiData {
  nhits: number;
  parameters: CitiesApiParams;
  records: CityRecord[];
}

const defaultAvailableCitiesData: CitiesApiData = { nhits: 0, parameters: { start: 0 }, records: [] };

const CitySelector = ({ availableCitiesPerPage = 10, onSelect }: CitySelectorProps): JSX.Element => {
  const [enteredCity, setEnteredCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [availableCitiesCurrentOffset, setAvailableCitiesCurrentOffset] = useState(0);
  const [availableCitiesData, setAvailableCitiesData] = useState(defaultAvailableCitiesData);

  const getCities = async (search: string, offset = 0) => {
    const { data } = await axios.get(
      citiesApiRoot,
      {
        params: {
          dataset: 'geonames-all-cities-with-a-population-1000',
          q: search,
          rows: availableCitiesPerPage,
          sort: 'name',
          start: offset,
          lang: 'ru'
        }
      },
    );
  
    setAvailableCitiesData(data);
  }; 
  
  const availableCities: IdAndName[] = useMemo(
    () => (availableCitiesData as CitiesApiData).records.map(
      (record: CityRecord) => ({ name: record.fields.name, id: record.recordid })
    ),
    [availableCitiesData],
  );

  const availableCitiesCount: number = useMemo(
    () => (availableCitiesData as CitiesApiData).nhits, [availableCitiesData]
  );

  const debouncedGetCities = useCallback(_.debounce(getCities, 1000), [availableCitiesPerPage]);

  const handleInput: FormEventHandler = async e => {
    setEnteredCity((e.target as HTMLInputElement).value);
    setSelectedCityId(null);
  };

  useEffect(() => {
    setAvailableCitiesCurrentOffset(0);
    setAvailableCitiesData(defaultAvailableCitiesData);
    debouncedGetCities(enteredCity);
  }, [enteredCity]);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return
    }

    getCities(enteredCity);
  }, [availableCitiesPerPage]);

  const handleSelect = (cityData: IdAndName) => {
    if (cityData.id) {
      setSelectedCityId(cityData.id);
      onSelect(cityData.name);
    }
  };

  const forwardDisabled = useMemo(
    () => availableCitiesCount - availableCitiesCurrentOffset <= availableCitiesPerPage,
    [availableCitiesCurrentOffset, availableCitiesCount, availableCitiesPerPage]
  );

  const backwardDisabled = useMemo(
    () => availableCitiesCurrentOffset - availableCitiesPerPage < 0,
    [availableCitiesCurrentOffset, availableCitiesPerPage]
  );

  const handlePageForward = () => {
    if (forwardDisabled) {
      return;
    }

    const newOffset = availableCitiesCurrentOffset + availableCitiesPerPage;

    setAvailableCitiesCurrentOffset(availableCitiesCurrentOffset + availableCitiesPerPage);
    getCities(enteredCity, newOffset);
  };

  const handlePageBackward = () => {
    if (backwardDisabled) {
      return;
    }

    const newOffset = availableCitiesCurrentOffset - availableCitiesPerPage;

    setAvailableCitiesCurrentOffset(availableCitiesCurrentOffset - availableCitiesPerPage);
    getCities(enteredCity, newOffset);

  };

  const currentPage = useMemo(
    () => Math.floor(availableCitiesCurrentOffset / availableCitiesPerPage),
    [availableCitiesCurrentOffset, availableCitiesPerPage]
  );
  
  const totalPages = useMemo(
    () => Math.floor(availableCitiesCount / availableCitiesPerPage),
    [availableCitiesCount, availableCitiesPerPage],
  );

  return (
    <div className="CitySelector">
      <input
        className="CitySelector__input"
        value={enteredCity}
        onInput={handleInput}
        placeholder="Поиск города"
      />
      <div className="container">
        <div>
          {availableCities.map((city: IdAndName) =>
            <div
              className={classNames(['CitySelector__option', { 'CitySelector__option_selected': city.id === selectedCityId }])}
              onClick={() => handleSelect(city)}
              key={city.id}
            >
              {city.name}
            </div>
          )}
        </div>
        <div className="CitySelector__pagination">
          <div
            className={classNames(['CitySelector__listArrow', 'CitySelector__listArrow_left', { CitySelector__listArrow_disabled: backwardDisabled }])}
            onClick={handlePageBackward}
          >
            {'<<'}
          </div>
          <div className="CitySelector__pageIndicator">{currentPage}/{totalPages}</div>
          <div
            className={classNames(['CitySelector__listArrow', 'CitySelector__listArrow_right', { CitySelector__listArrow_disabled: forwardDisabled }])}
            onClick={handlePageForward}
          >
            {'>>'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitySelector;
