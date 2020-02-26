import {
  MODE_RANGE, MODE_SINGLE,
  VIEW_MODE_DOUBLE,
  VIEW_MODE_SINGLE, VIEW_MODE_CUSTOM
} from './utils/constants';
import { getDateSelectStrategy } from './utils/get-date-select-strategy';
import {
  shouldPreventMonthChange,
  generateCalendarViewData,
  resetDate,
  getMonthsList
} from './utils/renderless-calendar.service';
import CalendarDate from './classes/CalendarDate';
import {
  getMonthDateSafely,
  isEqual,
  isMarked,
  isNextDate,
  isPrevDate,
  isRestricted
} from './utils/renderless-date.service';
import { viewModeInitializer, getViewNavigator } from './utils/view-mode.service';
import { getCalendarStringsForLocale } from './utils/locale-strings';
/**
 * @typedef {{
 *  months:{short: string, long: string}[],
 *  days:{short: string, long: string}[]
 * }} LocaleStrings
 */

export default {
  name: 'RenderlessCalendar',

  props: {
    viewMode: {
      type: String,
      validator(v) {
        return [VIEW_MODE_SINGLE, VIEW_MODE_DOUBLE, VIEW_MODE_CUSTOM].indexOf(v) !== -1;
      },
      default: VIEW_MODE_SINGLE
    },
    customNumberOfMonths: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      validator(value) {
        return [MODE_SINGLE, MODE_RANGE].indexOf(value) !== -1;
      },
      default: MODE_SINGLE
    },
    locale: {
      type: String,
      default: ''
    },
    minDate: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    },
    preventOutOfRange: {
      default: true,
      type: Boolean
    },
    captureThirdDate: {
      type: Boolean,
      default: false
    },
    dateSelectStrategy: {
      type: Function,
      default: null
    },
    defaultSelectedDates: {
      type: Array,
      default: () => []
    },
    captureHover: {
      type: Boolean,
      default: true
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

  data() {
    return {
      today: new Date(),
      calendar: null,
      selectedDates: [],
      currentMonth: null,
      currentYear: null,
      currentHoveredDate: null,
      viewState: []
    };
  },

  created() {
    this.selectedDates = this.defaultSelectedDates.map(CalendarDate.fromString);

    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();

    this.viewState = viewModeInitializer(this.viewMode, this.customNumberOfMonths);
    this.viewNavigator = getViewNavigator(this.viewMode);
    this.calendar = Object.freeze(generateCalendarViewData({
      numberOfMonths: this.customNumberOfMonths,
      month: this.currentMonth,
      viewMode: this.viewMode,
      year: this.currentYear
    }));
  },

  computed: {
    /**
     * @return {LocaleStrings}
     */
    localeStrings() {
      return getCalendarStringsForLocale(this.locale);
    },
    weekDayNames() {
      // @ts-ignore
      return Object.freeze(this.localeStrings.days);
    },
    monthNames() {
      // @ts-ignore
      return Object.freeze(this.localeStrings.months.map((month, id) => ({ ...month, id })));
    },
    monthsList() {
      return getMonthsList({
        currentMonth: this.currentMonth,
        currentYear: this.currentYear,
        monthNames: this.monthNames,
        viewState: this.viewState
      });
    },
    canGoToPrevMonth() {
      const [{ month, year }] = this.viewState;

      return !shouldPreventMonthChange({
        minDate: this.minDate,
        maxDate: this.maxDate,
        currentMonth: month,
        currentYear: year,
        step: -1
      });
    },
    canGoToNextMonth() {
      const { month, year } = this.viewState[this.viewState.length - 1];

      return !shouldPreventMonthChange({
        minDate: this.minDate,
        maxDate: this.maxDate,
        currentMonth: month,
        currentYear: year,
        step: 1
      });
    }
  },

  methods: {
    onDateSelect(date) {
      if (isRestricted(date.formatted, {
        disabledDates: this.disabledDates,
        maxDate: this.maxDate,
        minDate: this.minDate
      })) {
        return;
      }

      this.setDates(this.dateChangeHangler(this.selectedDates, date));
    },
    onDateMouseOver(date) {
      this.currentHoveredDate = date;
    },
    onDateMouseOut() {
      this.currentHoveredDate = null;
    },
    setDates(dates) {
      this.selectedDates = dates;
      this.$emit('onDateChange', dates);
    },
    resetDates(index) {
      this.setDates(resetDate(this.selectedDates, index));
    },
    prevPage() {
      const { viewState, viewMode, customNumberOfMonths } = this;
      const [date] = viewState;
      const { year, month } = date;
      let newViewState = [];

      if (this.shouldPreventMonthChange(year, month, -1)) {
        return;
      }

      const prevMonthDate = getMonthDateSafely(year, month - 1);

      const calendar = generateCalendarViewData({
        numberOfMonths: customNumberOfMonths,
        year: prevMonthDate.getFullYear(),
        month: prevMonthDate.getMonth(),
        viewMode
      });

      if (viewMode === VIEW_MODE_SINGLE) {
        newViewState = [{
          year: prevMonthDate.getFullYear(),
          month: prevMonthDate.getMonth()
        }];
      } else if (viewMode === VIEW_MODE_DOUBLE) {
        const first = viewState[0];

        newViewState = [{
          year: prevMonthDate.getFullYear(),
          month: prevMonthDate.getMonth()
        }, first];
      }

      this.calendar = calendar;
      this.viewState = newViewState;

    },
    nextPage() {
      const { viewMode, viewState, customNumberOfMonths } = this;
      let newViewState = [];
      let { year, month } = viewMode === VIEW_MODE_SINGLE
        ? viewState[0]
        : viewState[1];

      if (this.shouldPreventMonthChange(year, month, 1)) {
        return;
      }

      if (viewMode === VIEW_MODE_DOUBLE) {
        const first = viewState[0];
        year = first.year;
        month = first.month;
      }

      const nextMonthDate = getMonthDateSafely(year, month + 1);

      const calendar = generateCalendarViewData({
        numberOfMonths: customNumberOfMonths,
        year: nextMonthDate.getFullYear(),
        month: nextMonthDate.getMonth(),
        viewMode
      });

      if (viewMode === VIEW_MODE_SINGLE) {
        newViewState = [{
          year: nextMonthDate.getFullYear(),
          month: nextMonthDate.getMonth()
        }];
      } else if (viewMode === VIEW_MODE_DOUBLE) {
        const second = viewState[1];
        const nextMonthDate = getMonthDateSafely(year, month + 2);

        newViewState = [second, {
          year: nextMonthDate.getFullYear(),
          month: nextMonthDate.getMonth()
        }];
      }

      this.calendar = calendar;
      this.viewState = newViewState;
    },
    shouldPreventMonthChange(year, month, step) {
      return this.preventOutOfRange && shouldPreventMonthChange({
        currentMonth: month,
        currentYear: year,
        minDate: this.minDate,
        maxDate: this.maxDate,
        step
      });
    },
    setMonth(monthListItem) {
      const { month, year } = monthListItem;
      const { viewMode, customNumberOfMonths } = this;
      let newViewState = [];

      if (viewMode === VIEW_MODE_SINGLE) {
        newViewState = [{ month, year }];
      } if (viewMode === VIEW_MODE_DOUBLE) {
        const nextMonthDate = getMonthDateSafely(year, month + 1);

        newViewState = [{ month, year }, {
          year: nextMonthDate.getFullYear(),
          month: nextMonthDate.getMonth()
        }];
      }

      this.calendar = generateCalendarViewData({
        numberOfMonths: customNumberOfMonths,
        viewMode,
        month,
        year
      });
      this.viewState = newViewState;
    },
    isBetween(date) {
      return this.captureHover && date.isBetween({
        currentHoveredDate: this.currentHoveredDate,
        captureThirdDate: this.captureThirdDate,
        selectedDates: this.selectedDates
      });
    },
    isSelected(date) {
      return date.isSelected(this.selectedDates);
    },
    isDisabled(date) {
      return isRestricted(date.formatted, {
        disabledDates: this.disabledDates,
        maxDate: this.maxDate,
        minDate: this.minDate
      });
    },
    isOneDayAfter(date) {
      return this.selectedDates
        .map(_ => _.formatted)
        .some(formatted => isNextDate(formatted, date.formatted));
    },
    isOneDayBefore(date) {
      return this.selectedDates
        .map(_ => _.formatted)
        .some(formatted => isPrevDate(formatted, date.formatted));
    },
    isOneDayBeforeFirst(date) {
      const first = this.selectedDates[0];
      return first && isPrevDate(first.formatted, date.formatted);
    },
    isOneDayAfterFirst(date) {
      const first = this.selectedDates[0];
      return first && isNextDate(date.formatted, first.formatted);
    },
    isOneDayBeforeLast(date) {
      const last = this.selectedDates[1];
      return last && isPrevDate(last.formatted, date.formatted);
    },
    isOneDayAfterLast(date) {
      const last = this.selectedDates[1];
      return last && isNextDate(date.formatted, last.formatted);
    },
    isFirst(date) {
      const first = this.selectedDates[0];
      return first && isEqual(date.formatted, first.formatted);
    },
    isLast(date) {
      const last = this.selectedDates[1];
      return last && isEqual(date.formatted, last.formatted);
    },
    isMarked(date) {
      return isMarked(date.formatted, this.markedDates);
    },
    getModifiers(date) {
      return {
        isBetween: this.isBetween(date),
        isSelected: this.isSelected(date),
        isDisabled: this.isDisabled(date),
        isOneDayAfter: this.isOneDayAfter(date),
        isOneDayBefore: this.isOneDayBefore(date),
        isOneDayBeforeFirst: this.isOneDayBeforeFirst(date),
        isOneDayAfterFirst: this.isOneDayAfterFirst(date),
        isOneDayBeforeLast: this.isOneDayBeforeLast(date),
        isOneDayAfterLast: this.isOneDayAfterLast(date),
        isFirst: this.isFirst(date),
        isLast: this.isLast(date),
        isMarked: this.isMarked(date)
      };
    }
  },

  watch: {
    mode: {
      handler(mode) {
        this.dateChangeHangler = this.dateSelectStrategy || getDateSelectStrategy(mode);
      },
      immediate: true
    },
    defaultSelectedDates(dates) {
      this.selectedDates = dates.map(CalendarDate.fromString);
    }
  },

  render() {
    return this.$scopedSlots.default({
      weekDayNames: this.weekDayNames,
      monthNames: this.monthNames,
      monthsList: this.monthsList,

      calendar: this.calendar,
      selectedDates: this.selectedDates,
      currentMonth: this.currentMonth,
      currentYear: this.currentYear,

      canGoToPrevMonth: this.canGoToPrevMonth,
      canGoToNextMonth: this.canGoToNextMonth,

      prevPage: this.prevPage,
      nextPage: this.nextPage,
      resetDates: this.resetDates,
      setMonth: this.setMonth,

      onDateMouseOut: this.onDateMouseOut,
      onDateMouseOver: this.onDateMouseOver,
      onDateSelect: this.onDateSelect,

      getModifiers: this.getModifiers
    });
  }
};
