import { MONTH_INDEX_CORRECTION, DAYS_IN_WEEK } from '../utils/constants';
import { prependZero } from '../utils/fns';
import {
  isSelected,
  isBetween,
  isWeekend,
  isToday
} from '../utils/renderless-date.service';

export default function CalendarDate(year, month, day, {
  isOtherMonthDay,
  firstDayOfWeek
} = { isOtherMonthDay: false, firstDayOfWeek: 1 }) {
  const date = new Date(year, month, day);

  this.ms = date.valueOf();

  // + DAYS_IN_WEEK avoids having negative number in the modulo (-1 % 7 -> 6 % 7)
  this.dayOfWeek = (date.getDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;

  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.day = date.getDate();

  this.actualMonthNumber = this.month + MONTH_INDEX_CORRECTION;
  this.formatted = [this.year, this.actualMonthNumber, this.day]
    .map(prependZero).join('-');

  this.isWeekend = isWeekend(date);
  this.isToday = isToday(date);
  this.isOtherMonthDay = isOtherMonthDay;
}

CalendarDate.fromString = function (date, { firstDayOfWeek } = { firstDayOfWeek: 1 }) {
  const [year, month, day] = date.split('-');
  return new CalendarDate(year, month - MONTH_INDEX_CORRECTION, day, { firstDayOfWeek });
};

CalendarDate.prototype.isBetween = function ({
  currentHoveredDate,
  captureThirdDate,
  selectedDates
}) {
  if (selectedDates.length === 0) {
    return false;
  }

  const { formatted } = this;
  const [left, right] = selectedDates;

  const formattedHoveredDate = currentHoveredDate && currentHoveredDate.formatted;
  const formattedLeftDate = left && left.formatted;
  const formattedRightDate = right && right.formatted;

  if (!right && formattedHoveredDate) {
    return isBetween(formatted, [formattedLeftDate, formattedHoveredDate])
      || isBetween(formatted, [formattedHoveredDate, formattedLeftDate]);
  }

  if (captureThirdDate && formattedHoveredDate) {
    return isBetween(formatted, [formattedLeftDate, formattedHoveredDate])
      || isBetween(formatted, [formattedHoveredDate, formattedRightDate]);
  }

  return isBetween(formatted, [formattedLeftDate, formattedRightDate]);
};


CalendarDate.prototype.isSelected = function (selectedDates = []) {
  return isSelected(this.formatted, selectedDates.map(_ => _.formatted));
};
