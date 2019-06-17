import {
  MODE_RANGE, MODE_SINGLE,
  VIEW_MODE_DOUBLE,
  VIEW_MODE_INFINITE,
  VIEW_MODE_SINGLE
} from './utils/constants';
import { getDateSelectStrategy } from './utils/get-date-select-strategy';
import {
  shouldPreventMonthChange,
  generateCalendarViewData,
  resetDate,
  getMonthsList
} from './utils/renderless-calendar.service';
import CalendarDate from './classes/CalendarDate';
import { getMonthDateSafely } from './utils/renderless-date.service';
import { viewModeInitializer, getViewNavigator } from './utils/view-mode.service';

export default {
  name: 'RenderlessCalendar',

  props: {
    viewMode: {
      type: String,
      validator(v) {
        return [VIEW_MODE_SINGLE, VIEW_MODE_DOUBLE, VIEW_MODE_INFINITE].indexOf(v) !== -1;
      },
      default: VIEW_MODE_SINGLE
    },
    mode: {
      type: String,
      validator(value) {
        return [MODE_SINGLE, MODE_RANGE].indexOf(value) !== -1;
      },
      default: MODE_SINGLE
    },
    locale: {
      type: Object,
      required: true
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

    this.viewState = viewModeInitializer(this.viewMode);
    this.viewNavigator = getViewNavigator(this.viewMode);

    this.calendar = Object.freeze(generateCalendarViewData(this.currentYear, this.currentMonth, this.viewMode));
  },

  computed: {
    weekDayNames() {
      return Object.freeze(this.locale.days);
    },
    monthNames() {
      return Object.freeze(this.locale.months.map((month, idx) => Object.assign(month, { id: idx })));
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
    canGoToNexMonth() {
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
      this.selectedDates = this.dateChangeHangler(this.selectedDates, date);
      this.$emit('onDateChange', this.selectedDates);
    },
    onDateMouseOver(date) {
      this.currentHoveredDate = date;
    },
    onDateMouseOut() {
      this.currentHoveredDate = null;
    },
    resetDates(index) {
      this.selectedDates = resetDate(this.selectedDates, index);
    },
    prevPage() {
      const { viewState, viewMode } = this;
      const [date] = viewState;
      const { year, month } = date;
      let newViewState = [];

      if (this.shouldPreventMonthChange(year, month, -1)) {
        return;
      }

      const prevMonthDate = getMonthDateSafely(year, month - 1);

      const calendar = generateCalendarViewData(
        prevMonthDate.getFullYear(),
        prevMonthDate.getMonth(),
        viewMode
      );

      if (viewMode === VIEW_MODE_SINGLE) {
        newViewState = [{
          year: prevMonthDate.getFullYear(),
          month: prevMonthDate.getMonth()
        }];
      } if (viewMode === VIEW_MODE_DOUBLE) {
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
      const { viewMode, viewState } = this;
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

      const calendar = generateCalendarViewData(
        nextMonthDate.getFullYear(),
        nextMonthDate.getMonth(),
        viewMode
      );

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
    isBetween(date) {
      return this.captureHover && date.isBetween({
        currentHoveredDate: this.currentHoveredDate,
        captureThirdDate: this.captureThirdDate,
        selectedDates: this.selectedDates
      });
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
      const { viewMode } = this;
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

      this.calendar = generateCalendarViewData(year, month, viewMode);
      this.viewState = newViewState;
    }
  },

  watch: {
    mode: {
      handler(mode) {
        this.dateChangeHangler = this.dateSelectStrategy || getDateSelectStrategy(mode);
      },
      immediate: true
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
      isBetween: this.isBetween,

      canGoToPrevMonth: this.canGoToPrevMonth,
      canGoToNexMonth: this.canGoToNexMonth,

      prevPage: this.prevPage,
      nextPage: this.nextPage,
      resetDates: this.resetDates,
      setMonth: this.setMonth,

      onDateMouseOut: this.onDateMouseOut,
      onDateMouseOver: this.onDateMouseOver,
      onDateSelect: this.onDateSelect
    });
  }
};
