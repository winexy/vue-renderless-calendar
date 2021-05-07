import { MILLISECONDS_IN_DAY, SATURDAY, SUNDAY } from './constants';

export function fromFormatted(formatted) {
  return new Date(...formatted.split('-'));
}

export function isBetween(date, datesRange) {
  const [left, right] = datesRange;
  return isGreaterThan(date, left) && isLessThan(date, right);
}


export function isSelected(date, selectedDates) {
  return selectedDates.some(selectedDate => isEqual(selectedDate, date));
}


export function isDisabled(date, disabledDates) {
  return disabledDates.indexOf(date) !== -1;
}


export function isToday(date) {
  const today = new Date();

  return today.getDate() === date.getDate()
    && today.getMonth() === date.getMonth()
    && today.getFullYear() === date.getFullYear();
}


export function isWeekend(date) {
  const day = date.getDay();
  return day === SUNDAY || day === SATURDAY;
}

export function isPrevDate(date, referenceDate) {
  return isOneDayAfter(referenceDate, date);
}

export function isNextDate(date, referenceDate) {
  return isOneDayAfter(date, referenceDate);
}

export function isOneDayAfter(date, referenceDate) {
  const date1 = fromFormatted(date).valueOf();
  const date2 = fromFormatted(referenceDate).valueOf();

  return date1 - date2 === MILLISECONDS_IN_DAY;
}

export function isLessThan(date, referenceDate) {
  return date < referenceDate;
}

export function isGreaterThan(date, referenceDate) {
  return date > referenceDate;
}

export function isEqual(date, referenceDate) {
  return date === referenceDate;
}

export function isSameMonth(month1, month2) {
  return month1 === month2;
}

export function isMarked(date, markedDates) {
  return markedDates.indexOf(date) !== -1;
}

export function getMonthDateSafely(year, month) {
  return new Date(year, month);
}

export function isRestricted(date, {
  disabledDates = [],
  maxDate = '',
  minDate = ''
}) {
  return (minDate && isLessThan(date, minDate))
    || (maxDate && isGreaterThan(date, maxDate))
    || (isDisabled(date, disabledDates));
}
