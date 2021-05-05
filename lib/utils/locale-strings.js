const CALENDAR_STRINGS = {};
/**
 * @typedef {{
 *  months:{short: string, full: string}[],
 *  days:{short: string, full: string}[]
 * }} LocaleStrings
 */
/**
 * @param {string} locale
 * @return {LocaleStrings}
 */
export function getCalendarStringsForLocale(locale) {
  if (!(/^[a-z]{2,3}(-[A-Za-z]{2})?$/).test(locale)) {
    locale = navigator ? navigator.language : 'en';
  }
  if (!CALENDAR_STRINGS.hasOwnProperty(locale)) {
    CALENDAR_STRINGS[locale] = generateLocaleStrings(locale);
  }
  return CALENDAR_STRINGS[locale];
}

/**
 * @param {string} locale
 * @return {LocaleStrings}
 */
function generateLocaleStrings(locale) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDay();

  const months = [...Array(12)].map((_, i) => {
    const d = new Date(year, i);
    return {
      short: d.toLocaleString(locale, { month: 'short' }),
      full: d.toLocaleString(locale, { month: 'long' })
    };
  });
  const firstMondayDate = today.getDate() - day + (day === 0 ? -6 : 1);
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(year, month, firstMondayDate + i);
    return {
      short: d.toLocaleString(locale, { weekday: 'short' }),
      full: d.toLocaleString(locale, { weekday: 'long' })
    };
  });
  return { months, days };
}
