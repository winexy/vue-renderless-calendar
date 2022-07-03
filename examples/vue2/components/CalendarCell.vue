<template>
  <!--v-if="!date.isOtherMonthDay"-->
  <button class="calendar-cell" :data-date="date.day" :class="rootClasses">
    {{ date.day }}
  </button>
  <!--<div class="calendar-cell" v-else></div>-->
</template>

<script>
  export default {
    name: 'CalendarCell',
    inheritAttrs: false,
    props: {
      date: {
        required: true,
        type: Object,
      },
      selectedDates: {
        type: Array,
      },
      isSelected: {
        default: false,
        type: Boolean,
      },
      isDisabled: {
        default: false,
        type: Boolean,
      },
      isBetween: {
        default: false,
        type: Boolean,
      },
      isOneDayBefore: {
        default: false,
        type: Boolean,
      },
      isOneDayAfter: {
        default: false,
        type: Boolean,
      },
      isLast: {
        default: false,
        type: Boolean,
      },
      isFirst: {
        default: false,
        type: Boolean,
      },
      isOneDayBeforeFirst: {
        default: false,
        type: Boolean,
      },
      isOneDayAfterFirst: {
        default: false,
        type: Boolean,
      },
      isOneDayBeforeLast: {
        default: false,
        type: Boolean,
      },
      isOneDayAfterLast: {
        default: false,
        type: Boolean,
      },
    },
    computed: {
      rootClasses() {
        return {
          '--is-other-month-day': this.date.isOtherMonthDay,
          '--selected': this.isSelected,
          '--weekend': this.date.isWeekend,
          '--disabled': this.isDisabled,
          '--between': this.isBetween,
          '--first': this.isFirst,
          '--last': this.isLast,
          '--one-day-before': this.isOneDayBefore,
          '--one-day-after': this.isOneDayAfter,
          '--one-day-before-first': this.isOneDayBeforeFirst,
          '--one-day-after-first': this.isOneDayAfterFirst,
          '--one-day-before-last': this.isOneDayBeforeLast,
          '--one-day-after-last': this.isOneDayAfterLast,
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  $cell-width: 40px;
  $cell-height: 40px;
  $radius: 3px;

  $color-primary: #387fbf;
  $color-accent: #ff8a00;
  $light-gray: #f7f7f9;

  .calendar-cell {
    border-radius: 3px;
    border: none;
    appearance: none;
    margin: 2px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: $cell-height;
    width: $cell-width;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    color: #50696d;
    background-color: transparent;

    &:not(.--disabled):not(.--selected):hover {
      background-color: #9ea4b5;
      color: $light-gray;
    }
    &.--disabled:not(.--between) {
      opacity: 0.1;
    }
    &.--between {
      background-color: $light-gray;
      border-radius: 0;
    }
    &.--weekend {
      color: $color-primary;
    }
    &.--selected {
      background-color: darken($light-gray, 5%);
      border-radius: 0;
    }
    &.--is-other-month-day:not(.--disabled):not(.--between):not(.--selected) {
      opacity: 0.5;
    }
    &:focus:not(.--selected) {
      outline: none;
      background-color: $light-gray;
      opacity: 1;
    }
    &.--between:focus {
      background-color: darken($light-gray, 3%);
    }
    &.--selected:focus {
      outline: none;
      background-color: darken($light-gray, 10%);
    }
  }

  .price {
    display: block;
    color: #383838;
    font-size: 10px;
  }

  .calendar-cell.--selected {
    .price {
      color: #fff;
    }
  }
</style>
