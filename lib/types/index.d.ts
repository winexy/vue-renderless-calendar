import Vue from "vue";
import { CombinedVueInstance } from "vue/types/vue";

export class CalendarDate {
  ms: number
  dayOfWeek: number
  year: number
  month: number
  day: number
  actualMonthNumber: number
  formatted: string
  isWeekend: boolean
  isToday: boolean
  isOtherMonthDay: boolean

  constructor(year: number, month: number, day: number, options: { isOtherMonthDay: boolean, firstDayOfWeek: number })

  fromString(date, options: { firstDayOfWeek: number }): string;

  static isBetween(options: { currentHoveredDate, captureThirdDate, selectedDates }): boolean;

  static isSelected(isSelected: any): boolean;
}

export type MODES = 'single' | 'range';
export type VIEW_MODES = 'single' | 'double' | 'custom';

type DigitNoZero = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Digit = '0' | DigitNoZero
type DayFirstDigit = '1' | '2' | '3'
type DayNb = `0${DigitNoZero}` | `1${Digit}` | `2${Digit}` | `3${'0' | '1'}`
type MonthNb = `0${Digit}` | `1${'0' | '1' | '2'}`
type YearNb = `${number}` // Year type is too complicated for Typescript to be described as four digits
export type DateFormat = `${YearNb}-${MonthNb}-${DayNb}`

export interface MonthName {
  short: string
  full: string
  id: number
}

export interface Month extends MonthName {
  isActive: boolean
  month: number
  year: number
}

export type MonthYear = Pick<Month, 'month' | 'year'>

export interface Calendar {
  dates: Array<CalendarDate>,
  month: number,
  year: number
}

export interface Modifiers<T> {
  isBetween(date: T): boolean
  isSelected(date: T): boolean
  isDisabled(date: T): boolean
  isOneDayAfter(date: T): boolean
  isOneDayBefore(date: T): boolean
  isOneDayBeforeFirst(date: T): boolean
  isOneDayAfterFirst(date: T): boolean
  isOneDayBeforeLast(date: T): boolean
  isOneDayAfterLast(date: T): boolean
  isFirst(date: T): boolean
  isLast(date: T): boolean
  isMarked(date: T): boolean
}

type Props = {
  startDate: Date | string,
  viewMode: VIEW_MODES
  customNumberOfMonths: number
  mode: MODES
  locale: string | object
  minDate: DateFormat
  maxDate: DateFormat
  preventOutOfRange: boolean
  captureThirdDate: boolean
  dateSelectStrategy: Function
  defaultSelectedDates: Array<DateFormat>
  captureHover: boolean
  disabledDates: Array<DateFormat>
  markedDates: Array<DateFormat>
  firstDayOfWeek: number
}

type Data = {
  calendar: Array<Calendar>,
  selectedDates: Array<CalendarDate>,
  currentMonth: number | null,
  currentYear: number | null,
  currentHoveredDate: DateFormat | null,
  viewState: Array<any>
}

type Computed = {
  localeStrings: string
  weekDayNames: string[]
  monthNames: Month[]
  monthsList: Month[]
  canGoToPrevMonth: boolean
  canGoToNextMonth: boolean
}

type Methods = {
  onDateSelect(date: CalendarDate): void
  onDateMouseOver(date: CalendarDate): void
  onDateMouseOut(): void
  setDates(dates: Array<DateFormat>): void
  resetDates(index: number): void
  prevPage(): void
  nextPage(): void
  /**
   * 
   * @param year The year as number
   * @param month The month index starting from 0
   * @param step The step (0 or 1)
   */
  shouldPreventMonthChange(year: number, month: number, step: number): boolean
  /**  */
  setMonth(monthListItem: MonthYear): void
  /**
   * Check if a date is between the current date selection
   * @param date The date to check if it's between the selection
   */
  isBetween(date: CalendarDate): boolean
  /** Return if the given date is currently selected */
  isSelected(date: CalendarDate): boolean
  /** Return if the given date is currently disabled */
  isDisabled(date: CalendarDate): boolean
  isOneDayAfter(date: CalendarDate): boolean
  isOneDayBefore(date: CalendarDate): boolean
  isOneDayBeforeFirst(date: CalendarDate): boolean
  isOneDayAfterFirst(date: CalendarDate): boolean
  isOneDayBeforeLast(date: CalendarDate): boolean
  isOneDayAfterLast(date: CalendarDate): boolean
  isFirst(date: CalendarDate): boolean
  isLast(date: CalendarDate): boolean
  isMarked(date: CalendarDate): boolean
  getModifiers(date: CalendarDate): Modifiers<CalendarDate>
}

export const RenderlessCalendar: CombinedVueInstance<Vue, Data, Methods, Computed, Props> & { name: string }
