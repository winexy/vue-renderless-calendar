# vue-renderless-calendar 📆

> Zero dependency Vue renderless calendar with scoped-slots API

## Install

```bash
npm i vue-renderless-calendar
yarn add vue-renderless-calendar
```

## RenderlessCalendar

> Main wrapper component which contains state of the calendar and other helpful data

### Props

| Prop                 | Required    | Type                  | Default             | Description
|----------------------|-------------|-----------------------|---------------------|----------------------------------
| viewMode             | false       | String                |                     | 'single', 'double', 'infinite'
| mode                 | false       | String                |                     | 'single', 'range'
| locale               | false       | Object or String      | navigator.language (client), 'en' (server)  | Locale string (e.g. 'ru'), it will automatically generate locale object using `Date.prototype.toLocaleString`, otherwise you can provide this object manually 
| minDate              | false       | String                | ''                  | Minimal valid date (`YYYY-MM-DDD`)
| maxDate              | false       | String                | ''                  | Maximal valid date (`YYYY-MM-DDD`)
| preventOutOfRange    | false       | Boolean               | true                | Prevent user go out of valid dates range
| dateSelectStrategy   | false       | Function              | null                | If you want custom behaviour for handling date select, you can implement this function
| defaultSelectedDates | false       | Array                 | []                  | Array of date strings with `YYYY-MM-DDD` format
| captureHover         | false       | Boolean               | true                | `captureHover` prop is used for computing dates which are between selected date and current hovered date
| captureThirdDate     | false       | Boolean               | false               | `captureThirdDate` prop is used for capturing dates between in case when 2 dates already selected and you have third element hovered
| disabledDates        | false       | Array<String>         | []                  | Array of `YYYY-MM-DDD` strings containing dates that can't be selected |
| markedDates          | false       | Array<String>         | []                  | Array of `YYYY-MM-DDD` strings with special meaning, that later will be accessed via `isMarked` modifier |
| firstDayOfWeek       | false       | number                | 1                   | Index of the weekday to start the week from. From 0 to 6. 0 is Sunday, 6 is Saturday |


### Scoped-slots properties

| Property          | Type                  | Description   |
|-------------------|-----------------------|---------------|
| weekDayNames      | Array                 | List of week days with short and full titles from `locale` object |
| monthNames        | Array                 | List of months with short and full titles from `locale` object    |
| monthsList        | Array                 | List of months which can be used for rendering months with possibility for changing current month view of calendar using `setMonth` method |
| calendar          | Array                 | Array of months with `month`, `year` number and array of `dates`    |
| selectedDates     | Array\<CalendarDate\> | Array of current selected dates|
| currentMonth      | Number                |               |
| currentYear       | Number                |               |
| canGoToPrevMonth  | Boolean               |               |
| canGoToNextMonth  | Boolean               |               |

### Scoped-slots Methods
| Property          | Arguments     | Description |
|-------------------|---------------|-------------|
| prevPage          | -             | Go to previous view iteration |
| nextPage          | -             | Go to next view iteration |
| resetDates        | -             | Set `selectedDates` to [] |
| setMonth          | monthListItem | Update views current active month |
| onDateMouseOut    | -             | Reset current hovered date |
| onDateMouseOver   | CalendarDate  | Set current hovered date |
| onDateSelect      | CalendarDate  | Append selected date to `selectedDates` array using "date select strategy" |
| getModifiers      | CalendarDate  | Returns |

### Events

| Event name   | Payload               |
|--------------|-----------------------|
| onDateChange | Array\<CalendarDate\> |

### Modifiers

> Object containing boolean properties that can be useful for computing styles

| Property             | Type     | Description
|----------------------|----------|---------------
| isSelected           | Boolean  |
| isBetween            | Boolean  |
| isDisabled           | Boolean  |
| isMarked             | Boolean  |
| isFirst              | Boolean  | is first selected date
| isLast               | Boolean  | is last selected date
| isOneDayAfter        | Boolean  | is one day after selected date
| isOneDayBefore       | Boolean  | is one date before selected date
| isOneDayBeforeFirst  | Boolean  |
| isOneDayAfterFirst   | Boolean  |
| isOneDayBeforeLast   | Boolean  |
| isOneDayAfterLast    | Boolean  |


## CalendarDate

> Class representing information about date

### Properties

| Property          | Type    | Description |
|-------------------|---------|-------------|
| year              | Number  |             |
| month             | Number  | 0-11        |
| day               | Number  | 1-31        |
| actualMonthNumber | Number  | Number of month with index correction |
| formatted         | String  | YYYY-MM-DD  |
| isWeekend         | Boolean |             |
| isToday           | Boolean |             |
| isOtherMonthDay   | Boolean | This field can be used to find out that this is the date from previous or next month |
