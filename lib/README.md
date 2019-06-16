days
- currentYear
- currentMonth
- defaultDates
- disabledDates
- locale
- mode
- minDate
- maxDate
- months
infinite
-- infinite issue

onDateMouseOver
onDateMouseOut
onMonthChange
onDateChange
onReset

- isBetween
- isSelected
- isDisabled
- isToday
- isWeekend
- isOtherMonthDay
- isMarked
- isFirstDate
- isLastDate
- isOneDayAfterFirstDate
- isOneDayAfterLastDate
- isOneDayBeforeFirstDate
- isOneDayBeforeLastDate





Views Strategies

### months=1

- currentMonth = 5
- currentYear = 2019
- data = [ [month] ]

fn prevMonth:
    validate left boundary


    validate right boundary

### months=2

- currentMonths = [5, 6]
- currentYears = [2019, 2019]
- data = [ [month], [month] ]

### months=Infinity=365days

- currentMonths = []
- data [ [month] * 12 ]


- resetDates
- resetFirstDate
- resetLastDate
- setMonth

- selectModeChanger

- canGoToPrevMonth
- canGoToNextMonth

- onThirdClickReset
