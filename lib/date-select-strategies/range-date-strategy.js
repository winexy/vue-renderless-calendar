export function rangeDateStrategy(dates, newDate) {
  if (dates.length === 0) {
    return [newDate];
  }

  const [firstDate, secondDate] = dates;

  if (dates.length === 1) {
    return sortDates(firstDate, newDate);
  }

  if (firstDate.formatted === newDate.formatted) {
    return [firstDate, newDate];
  }

  if (secondDate.formatted === newDate.formatted) {
    return [secondDate, newDate];
  }

  const diff1 = Math.abs(firstDate.ms - newDate.ms);
  const diff2 = Math.abs(secondDate.ms - newDate.ms);

  return diff1 < diff2
    ? sortDates(secondDate, newDate)
    : sortDates(firstDate, newDate);
}


function sortDates(date, comparedDate) {
  return [date, comparedDate].slice(0).sort((date1, date2) => date1.ms - date2.ms);
}
