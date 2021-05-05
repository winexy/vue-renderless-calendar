import test from 'ava';
import * as renderlessCalendarService from './renderless-calendar.service';


test('shouldPreventMonthChange', t => {
  let result = renderlessCalendarService.shouldPreventMonthChange({
    currentYear: 2019,
    currentMonth: 6,
    maxDate: '2019-06-01',
    minDate: '2019-02-01',
    step: 1
  });

  t.is(result, true);

  result = renderlessCalendarService.shouldPreventMonthChange({
    currentYear: 2019,
    currentMonth: 6,
    maxDate: '2019-10-01',
    minDate: '2019-07-01',
    step: -1
  });

  t.is(result, true);

  result = renderlessCalendarService.shouldPreventMonthChange({
    currentYear: 2019,
    currentMonth: 8,
    maxDate: '2019-12-01',
    minDate: '2019-02-01',
    step: -1
  });

  t.is(result, false);

  result = renderlessCalendarService.shouldPreventMonthChange({
    currentYear: 2019,
    currentMonth: 8,
    maxDate: null,
    minDate: null,
    step: -1
  });

  t.is(result, false);
});
