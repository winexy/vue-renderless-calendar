import { MODE_RANGE, MODE_SINGLE } from './constants';
import { singleDateStrategy } from '../date-select-strategies/single-date-strategy';
import { onThirdClickResetStrategy } from '../date-select-strategies/on-third-click-reset-strategy';
import { rangeDateStrategy } from '../date-select-strategies/range-date-strategy';

export function getDateSelectStrategy(mode) {
  switch (mode) {
    case MODE_SINGLE:
      return singleDateStrategy;
    case MODE_RANGE:
      return onThirdClickResetStrategy;
    default:
      throw new Error(`unkown mode: ${mode}`);
  }
}
