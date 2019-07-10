import test from 'ava';
import CalendarDate from './CalendarDate';

test('Should parse correctly using CalendarDate.fromString method', t => {
  const date = '2019-07-10';

  const calendarDate = CalendarDate.fromString(date);

  t.is(calendarDate.formatted, date);
  t.is(calendarDate.year, 2019);
  t.is(calendarDate.month, 6);
  t.is(calendarDate.day, 10);
  t.is(calendarDate.actualMonthNumber, 7);
});
