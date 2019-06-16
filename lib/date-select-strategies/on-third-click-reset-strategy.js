import { rangeDateStrategy } from './range-date-strategy';

export function onThirdClickResetStrategy(dates, newDate) {
  if (dates.length === 2) {
    console.log('response', [newDate]);
    return [newDate];
  }

  console.log('response', rangeDateStrategy(dates, newDate));
  return rangeDateStrategy(dates, newDate);
}
