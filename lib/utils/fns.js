export function prependZero(number) {
  if (number < 10) return `0${number}`;
  return number;
}
