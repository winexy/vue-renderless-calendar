import { DAYS_IN_WEEK } from './constants';

const CALENDAR_STRINGS = {};
/**
 * @typedef {{
 *  months:{short: string, full: string}[],
 *  days:{short: string, full: string}[]
 * }} LocaleStrings
 */
/**
 * @param {string} locale
 * @param {number} firstDayOfWeek Index of weekday to start the week from (0: sunday, 6: Saturday)
 * @return {LocaleStrings}
 */
export function getCalendarStringsForLocale(locale, firstDayOfWeek) {
  if (!(/^[a-z]{2,3}(-[A-Za-z]{2})?$/).test(locale)) {
    locale = navigator ? navigator.language : 'en';
  }
  if (!CALENDAR_STRINGS.hasOwnProperty(locale)) {
    CALENDAR_STRINGS[locale] = generateLocaleStrings(locale, firstDayOfWeek);
  }
  return CALENDAR_STRINGS[locale];
}

/**
 * @param {string} locale
 * @param {number} firstDayOfWeek Index of weekday to start the week from (0: sunday, 6: Saturday)
 * @return {LocaleStrings}
 */
function generateLocaleStrings(locale, firstDayOfWeek = 1) {
  const validFirstDayOfWeek = firstDayOfWeek % DAYS_IN_WEEK;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDay();

  const months = Array(12).fill().map((_, i) => {
    const d = new Date(year, i);
    return {
      short: d.toLocaleString(locale, { month: 'short' }),
      full: d.toLocaleString(locale, { month: 'long' })
    };
  });
  // Get day number - index of current weekday + the weekday index we want to start from
  // ex: 16 (16th in the month) - 2 (it's a Tuesday) = 14 (previous Sunday number) => + 1 to go to next Monday
  const firstMondayDate = today.getDate() - day + validFirstDayOfWeek;
  const days = Array(7).fill().map((_, i) => {
    const d = new Date(year, month, firstMondayDate + i);
    return {
      short: d.toLocaleString(locale, { weekday: 'short' }),
      full: d.toLocaleString(locale, { weekday: 'long' })
    };
  });
  return { months, days };
}
