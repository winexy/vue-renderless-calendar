import test from 'ava';
import * as localeStrings from './locale-strings';

test('sholdReturnCalendarLocale', t => {
  let res = localeStrings.getCalendarStringsForLocale('de-DE');
  t.is(res.months.length, 12);
  t.is(res.days.length, 7);
  t.is(typeof res.months[0].short, 'string');
  t.is(typeof res.months[0].full, 'string');
  t.is(typeof res.days[6].short, 'string');
  t.is(typeof res.days[6].full, 'string');
});
