# WIP: vue-renderless-calendar 📆

> Vue renderless calendar with scoped-slots API

## Install

```bash
npm i vue-renderless-calendar
yarn add vue-renderless-calendar
```

## Locale

```javascript
import enLocale from 'vue-renderless-calendar/dist/locale/en';
```


## Components

### RenderlessCalendar

#### Props

| Prop                 | Required    | Type       | Default | Description
|----------------------|-------------|------------|---------| ---------------------------------
| viewMode             | false       | String     |         | 'single', 'double', 'infinite'
| mode                 | false       | String     |         | 'single', 'range'
| locale               | true        | Object     |         | Locale object containing `months`, `days` properties
| minDate              | false       | String     | ''      | Minimal valid date (`YYYY-MM-DDD`)
| maxDate              | false       | String     | ''      | Maximal valid date (`YYYY-MM-DDD`)
| preventOutOfRange    | false       | Boolean    | true    | Prevent user go out of valid dates range
| dateSelectStrategy   | false       | Function   | null    | If you want custom behaviour for handling date select, you can implement this function
| defaultSelectedDates | false       | Array      | []      | Array of date strings with `YYYY-MM-DDD` format
| captureHover         | false       | Boolean    | true    | `captureHover` prop is used for computing dates which are between selected date and current hovered date
| captureThirdDate     | false       | Boolean    | false   | `captureThirdDate` prop is used for capturing dates between in case when 2 dates already selected and you have third element hovered

#### Scoped-slots properties

| Property          | Type                  | Arguments     | Description
|-------------------|-----------------------|---------------|------------
| weekDayNames      | Array                 |               |
| monthNames        | Array                 |               |
| monthsList        | Array                 |               |
| calendar          | Array\<CalendarDate\> |               |
| selectedDates     | Array                 |               |
| currentMonth      | Number                |               |
| currentYear       | Number                |               |
| isBetween         | Boolean               |               |
| canGoToPrevMonth  | Function              |               |
| canGoToNexMonth   | Function              |               |

#### Scoped-slots Methods
| Property          | Type     | Arguments     | Description
|-------------------|----------|---------------|-------------
| prevPage          | Function |               | Go to previous view iteration
| nextPage          | Function |               | Go to next view iteration
| resetDates        | Function |               | Set `selectedDates` to []
| setMonth          | Function | monthListItem | Update views current active month
| onDateMouseOut    | Function |               | Reset current hovered date
| onDateMouseOver   | Function | CalendarDate  | Set current hovered date
| onDateSelect      | Function | CalendarDate  | Append selected date to `selectedDates` array using "date select strategy"

#### Events

| Event name   | Payload
|--------------|------------------------
| onDateChange | Array\<CalendarDate\>

### RenderlessDate

