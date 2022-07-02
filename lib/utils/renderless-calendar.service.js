import {
  MAX_DAYS_IN_MONTH, MONTH_INDEX_CORRECTION,
  VIEW_MODE_DOUBLE,
  VIEW_MODE_SINGLE,
  VIEW_MODE_CUSTOM,
  ZERO_BASED_DAYS_IN_WEEK
} from './constants';
import {
  getMonthDateSafely,
  isEqual,
  isGreaterThan,
  isLessThan,
  isSameMonth
} from './renderless-date.service';
import CalendarDate from '../classes/CalendarDate';

const monthsEnum = {
  [VIEW_MODE_SINGLE]: 1,
  [VIEW_MODE_DOUBLE]: 2
};

export function generateCalendarViewData({
  numberOfMonths,
  viewMode,
  month,
  year,
  firstDayOfWeek
}) {
  const months = viewMode === VIEW_MODE_CUSTOM
    ? numberOfMonths
    : monthsEnum[viewMode];

  const result = [];
  const endMonth = month + months;
  let it = month;
  let currentYear = year;
  let currentMonth = month;

  while (it < endMonth) {
    const nextMonthDate = getMonthDateSafely(currentYear, currentMonth);
    const year = nextMonthDate.getFullYear();
    const month = nextMonthDate.getMonth();

    const currentMonthDates = getCurrentMonthDates(year, month, firstDayOfWeek);
    const prevMonthDates = getPrevMonthDates(currentMonthDates[0], firstDayOfWeek);
    const nextMonthDates = getNextMonthDates(currentMonthDates[currentMonthDates.length - 1], firstDayOfWeek);

    result.push({
      dates: [...prevMonthDates, ...currentMonthDates, ...nextMonthDates],
      month,
      year
    });

    currentYear = year;
    currentMonth = month + 1;
    it++;
  }

  return result;
}


export function getPrevMonthDates(date, firstDayOfWeek = 1) {
  return _getMonthLastNDays(date.dayOfWeek, date.year, date.month, { firstDayOfWeek });
}

export function getCurrentMonthDates(year, month, firstDayOfWeek = 1) {
  const dates = [];

  for (let day = 1; day <= MAX_DAYS_IN_MONTH; day++) {
    dates.push(new CalendarDate(year, month, day, { firstDayOfWeek }));
  }

  return dates.filter(date => isSameMonth(month, date.month));
}

export function getNextMonthDates(date, firstDayOfWeek = 1) {
  const numberOfDays = ZERO_BASED_DAYS_IN_WEEK - date.dayOfWeek;
  return _getMonthFirstNDays(numberOfDays, date.year, date.month, { firstDayOfWeek });
}

export function _getMonthLastNDays(n, year, month, firstDayOfWeek = 1) {
  const dates = [];
  const prevMonthNumber = month - 1;

  let dayNumber = MAX_DAYS_IN_MONTH;

  while (dates.length < n) {
    const date = new CalendarDate(year, prevMonthNumber, dayNumber, { isOtherMonthDay: true, firstDayOfWeek });

    if (!isSameMonth(month, date.month)) {
      dates.unshift(date);
    }

    dayNumber--;
  }

  return dates;
}

export function _getMonthFirstNDays(n, year, month, firstDayOfWeek = 1) {
  const dates = [];
  const nextMonthNumber = month + 1;

  for (let dayNumber = 1; dayNumber <= n; dayNumber++) {
    const date = new CalendarDate(year, nextMonthNumber, dayNumber, { isOtherMonthDay: true, firstDayOfWeek });
    dates.push(date);
  }

  return dates;
}

export function shouldPreventMonthChange({
  currentYear, currentMonth, minDate, maxDate, step
}) {

  return step === 1
    ? breaksUpperLimit(maxDate, currentYear, currentMonth)
    : breaksLowerLimit(minDate, currentYear, currentMonth);
}

export function breaksLowerLimit(minDate, currentYear, currentMonth) {
  if (!minDate) { return false; }

  const [year, month, day] = minDate.split('-');
  const date = new Date(year, month - MONTH_INDEX_CORRECTION, day);
  const minDateYear = date.getFullYear();
  const minDateMonth = date.getMonth();
  const prevMonth = currentMonth - 1;

  return isEqual(minDateYear, currentYear) && isGreaterThan(minDateMonth, prevMonth);
}

export function breaksUpperLimit(maxDate, currentYear, currentMonth) {
  if (!maxDate) { return false; }

  const [year, month, day] = maxDate.split('-');
  const date = new Date(year, month - MONTH_INDEX_CORRECTION, day);
  const maxDateYear = date.getFullYear();
  const maxDateMonth = date.getMonth();
  const nextMonth = currentMonth + 1;

  return isEqual(maxDateYear, currentYear) && isLessThan(maxDateMonth, nextMonth);
}

export function resetDate(dates, index) {
  return Number.isNaN(index)
    ? []
    : dates.filter((_, idx) => idx !== index);
}


export function getMonthsList({
  currentMonth,
  currentYear,
  monthNames,
  viewState
}) {
  const startIndex = currentMonth;
  const result = [];

  for (let i = startIndex; i <= startIndex + 12; i++) {
    const date = new Date(currentYear, i);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthData = monthNames[month];

    result.push({
      isActive: viewState.some(isActive(year, month)),
      id: `${year}-${month}`,
      short: monthData.short,
      full: monthData.full,
      month,
      year
    });
  }

  return result;

  function isActive(year, month) {
    return view => view.year === year && view.month === month;
  }
}
