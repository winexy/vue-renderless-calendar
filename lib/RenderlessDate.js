import CalendarDate from './classes/CalendarDate';
import {
  isEqual,
  isMarked,
  isNextDate,
  isPrevDate,
  isRestricted
} from './utils/renderless-date.service';

export default {
  name: 'RenderlessDate',

  props: {
    selectedDates: {
      required: true,
      type: Array
    },
    date: {
      required: true,
      validator: o => o instanceof CalendarDate
    },
    minDate: {
      default: '',
      type: String
    },
    maxDate: {
      default: '',
      type: String
    },
    disabledDates: {
      type: Array,
      default: () => []
    },
    markedDates: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    formatted() {
      return this.date.formatted;
    },
    isSelected() {
      return this.date.isSelected(this.selectedDates);
    },
    isDisabled() {
      return isRestricted(this.formatted, {
        disabledDates: this.disabledDates,
        maxDate: this.maxDate,
        minDate: this.minDate
      });
    },
    isOneDayAfter() {
      return this.selectedDates
        .map(_ => _.formatted)
        .some(formatted => isNextDate(formatted, this.formatted));
    },
    isOneDayBefore() {
      return this.selectedDates
        .map(_ => _.formatted)
        .some(formatted => isPrevDate(formatted, this.formatted));
    },
    isOneDayBeforeFirst() {
      const first = this.selectedDates[0];
      return first && isPrevDate(first.formatted, this.formatted);
    },
    isOneDayAfterFirst() {
      const first = this.selectedDates[0];
      return first && isNextDate(this.formatted, first.formatted);
    },
    isOneDayBeforeLast() {
      const last = this.selectedDates[1];
      return last && isPrevDate(last.formatted, this.formatted);
    },
    isOneDayAfterLast() {
      const last = this.selectedDates[1];
      return last && isNextDate(this.formatted, last.formatted);
    },
    isFirst() {
      const first = this.selectedDates[0];
      return first && isEqual(this.formatted, first.formatted);
    },
    isLast() {
      const last = this.selectedDates[1];
      return last && isEqual(this.formatted, last.formatted);
    },
    isMarked() {
      return isMarked(this.formatted, this.markedDates);
    }
  },

  render() {
    return this.$scopedSlots.default({
      isMarked: this.isMarked,

      isFirst: this.isFirst,
      isLast: this.isLast,
      isSelected: this.isSelected,
      isDisabled: this.isDisabled,

      isOneDayAfter: this.isOneDayAfter,
      isOneDayBefore: this.isOneDayBefore,

      isOneDayBeforeFirst: this.isOneDayBeforeFirst,
      isOneDayAfterFirst: this.isOneDayAfterFirst,

      isOneDayBeforeLast: this.isOneDayBeforeLast,
      isOneDayAfterLast: this.isOneDayAfterLast
    });
  }
};
