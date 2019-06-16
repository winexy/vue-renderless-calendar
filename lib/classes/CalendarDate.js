import { MONTH_INDEX_CORRECTION } from '../utils/constants';
import { prependZero } from '../utils/fns';
import {
  isSelected,
  isBetween,
  isWeekend,
  isToday
} from '../utils/renderless-date.service';

export default function CalendarDate(year, month, day, {
  isOtherMonthDay = false
} = {}) {
  const date = new Date(year, month, day);

  this.ms = date.valueOf();

  this.dayOfWeek = (date.getDay() + 6) % 7;

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

CalendarDate.fromString = function (date) {
  return new CalendarDate(...date.split('-'));
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
