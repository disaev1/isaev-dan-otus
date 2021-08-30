import moment from 'moment';

import { zeroK } from './constants';

const formattedTempC = (tempK: number): number => {
  return Math.round(tempK - zeroK);
}

const formattedDate = (dt: number, timezoneOffset = 0): string => {
  const date = moment(dt * 1000);

  return date.utcOffset(timezoneOffset).format('DD.MM.YYYY HH:mm');
};

export { formattedTempC, formattedDate };
