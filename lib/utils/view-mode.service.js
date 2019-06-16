import { VIEW_MODE_DOUBLE, VIEW_MODE_INFINITE, VIEW_MODE_SINGLE } from './constants';
import { getMonthDateSafely } from './renderless-date.service';

const initializers = {
  [VIEW_MODE_SINGLE]: initializeSingleViewMode,
  [VIEW_MODE_DOUBLE]: initializeDoubleViewMode,
  [VIEW_MODE_INFINITE]: initalizeInfiniteViewMode
};

export function viewModeInitializer(viewMode) {
  return initializers[viewMode]();
}


function initializeSingleViewMode() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return [{ year, month }];
}


function initializeDoubleViewMode() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const nextMonthDate = getMonthDateSafely(today.getFullYear(), today.getMonth() + 1);
  const nextMonthYear = nextMonthDate.getFullYear();
  const nextMonthNumber = nextMonthDate.getMonth();

  return [
    { year: currentYear, month: currentMonth },
    { year: nextMonthYear, month: nextMonthNumber }
  ];
}

function initalizeInfiniteViewMode() {
  const today = new Date();

  const pageState = [];
  const endMonth = today.getMonth() + 12;

  for (let month = today.getMonth(); month < endMonth; month++) {
    const date = getMonthDateSafely(today.getFullYear(), month);

    pageState.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
  }

  return pageState;
}

const viewNavigators = {
  [VIEW_MODE_SINGLE]: {
    prevPage: () => {},
    nextPage: () => {}
  },
  [VIEW_MODE_DOUBLE]: {
    prevPage: () => {},
    nextPage: () => {}
  }
};

export function getViewNavigator(viewMode) {
  return viewNavigators[viewMode];
}




