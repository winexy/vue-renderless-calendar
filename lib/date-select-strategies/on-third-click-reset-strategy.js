import { rangeDateStrategy } from './range-date-strategy';

export function onThirdClickResetStrategy(dates, newDate) {
  if (dates.length === 2) {
    return [newDate];
  }

  return rangeDateStrategy(dates, newDate);
}
