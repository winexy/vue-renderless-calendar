import test from 'ava';
import * as renderlessDateService from './renderless-date.service';

test('isToday', t => {
  const today = new Date();
  const notToday = new Date(2019, 5, 20);

  t.is(renderlessDateService.isToday(today), true);
  t.is(renderlessDateService.isToday(notToday), false);
});


test('isWeekend', t => {
  let weekendsCounter = 0;
  for (let d = 1; d <= 7; d++) {
    const date = new Date(2019, 4, d);

    if (renderlessDateService.isWeekend(date)) {
      weekendsCounter++;
    }
  }

  t.is(weekendsCounter, 2);
});


test('isLessThan', t => {
  const date1 = '2019-05-04';
  const date2 = '2019-05-05';
  const date3 = '2019-05-06';

  t.is(renderlessDateService.isLessThan(date1, date2), true);
  t.is(renderlessDateService.isLessThan(date3, date2), false);
});


test('isGreaterThan', t => {
  const date1 = '2019-05-04';
  const date2 = '2019-05-05';
  const date3 = '2019-05-06';

  t.is(renderlessDateService.isGreaterThan(date1, date2), false);
  t.is(renderlessDateService.isGreaterThan(date3, date2), true);
});


test('isDisabled', t => {
  const disabledDates = ['2019-05-13', '2019-05-20', '2019-06-13'];

  t.is(renderlessDateService.isDisabled('2019-05-20', disabledDates), true);
  t.is(renderlessDateService.isDisabled('2019-05-21', disabledDates), false);
});


test('isSelected', t => {
  const selectedDates = ['2019-04-23'];

  t.is(renderlessDateService.isSelected('2019-04-23', selectedDates), true);
  t.is(renderlessDateService.isSelected('2019-07-19', selectedDates), false);
});


test('isEqual', t => {
  t.is(renderlessDateService.isEqual('2019-04-23', '2019-04-23'), true);
  t.is(renderlessDateService.isEqual('2019-01-20', '2018-05-17'), false);
});


test('fromFormatted', t => {
  const formatted = '2019-4-12';
  const transformed = renderlessDateService.fromFormatted(formatted);

  t.is(transformed instanceof Date, true);
});


test('isMarked', t => {
  const markedDates = ['2019-04-10', '2019-04-12', '2019-05-21'];
  const date = '2019-05-21';
  const date2 = '2019-05-26';

  t.is(renderlessDateService.isMarked(date, markedDates), true);
  t.is(renderlessDateService.isMarked(date2, markedDates), false);
});

test('getMonthDateSafely', t => {

  const date = renderlessDateService.getMonthDateSafely(2019, 0);
  const date2 = renderlessDateService.getMonthDateSafely(2019, -1);

  t.is(date.getMonth(), 0);
  t.is(date.getFullYear(), 2019);

  t.is(date2.getMonth(), 11);
  t.is(date2.getFullYear(), 2018);

  const date3 = renderlessDateService.getMonthDateSafely(2019, 11);
  const date4 = renderlessDateService.getMonthDateSafely(2019, 14);

  t.is(date3.getMonth(), 11);
  t.is(date3.getFullYear(), 2019);

  t.is(date4.getMonth(), 2);
  t.is(date4.getFullYear(), 2020);
});

test('isRestricted without full parameters', t => {
  const minDate = '2019-06-01';
  const maxDate = '2019-06-31';
  const disabledDates = ['2019-06-20'];

  const test1 = renderlessDateService.isRestricted('2019-06-01', { disabledDates, minDate, maxDate });
  const test2 = renderlessDateService.isRestricted('2019-06-20', { disabledDates, minDate, maxDate });
  const test3 = renderlessDateService.isRestricted('2019-05-20', { disabledDates, minDate, maxDate });
  const test4 = renderlessDateService.isRestricted('2019-07-01', { disabledDates, minDate, maxDate });

  t.is(test1, false);
  t.is(test2, true);
  t.is(test3, true);
  t.is(test4, true);
});

test('isRestricted without min/max Date param', t => {
  const minDate = '2019-06-01';
  const maxDate = '2019-06-31';
  const disabledDates = ['2019-06-20'];
  const emptyDisabledDates = [];

  const test1 = renderlessDateService.isRestricted('2019-06-01', { disabledDates, maxDate });
  const test2 = renderlessDateService.isRestricted('2019-06-20', { disabledDates, maxDate });
  const test3 = renderlessDateService.isRestricted('2019-05-20', { disabledDates, maxDate });
  const test4 = renderlessDateService.isRestricted('2019-07-01', { disabledDates, minDate });
  const test5 = renderlessDateService.isRestricted('2019-06-20', { disabledDates: emptyDisabledDates, maxDate });

  t.is(test1, false);
  t.is(test2, true);
  t.is(test3, false);
  t.is(test4, false);
  t.is(test5, false);
});
