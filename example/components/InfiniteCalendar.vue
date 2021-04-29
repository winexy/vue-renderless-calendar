<template>
  <div>
    <button @click="open">
      open
    </button>
    <RenderlessCalendar
      v-slot="{
        getModifiers,
        selectedDates,
        currentYear,
        prevPage,
        nextPage,
        weekDayNames,
        monthNames,
        calendar,
        onDateMouseOut,
        onDateMouseOver,
        onDateSelect
      }"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      :marked-dates="['2019-05-29']"
      :custom-number-of-months="20"
      :locale="locale"
      prevent-out-of-range
      mode="range"
      view-mode="custom"
      :default-selected-dates="['2019-06-14', '2019-06-28']"
      :first-day-of-week="firstDayOfWeek"
      @onDateChange="handleDateChange"
    >
      <div class="root" :class="isOpened ? 'infinite-calendar' : ''">
        <div
          v-for="view in calendar"
          :key="`${view.month}-${view.year}`"
          class="calendar"
          :data-date-1="selectedDates[0] && selectedDates[0].formatted"
          :data-date-2="selectedDates[1] && selectedDates[1].formatted"
        >
          <div class="calendar__header">
            <span class="calendar__title" style="text-transform:capitalize">
              {{ monthNames[view.month].full }}, <strong style="font-weight: 800;">{{ view.year }}</strong>
            </span>
          </div>
          <div class="calendar__weeks">
            <span v-for="day in weekDayNames" :key="day.short" class="calendar__week-day">
              {{ day.short }}
            </span>
          </div>
          <div class="calendar__body">
            <CalendarCell
              v-for="date in view.dates"
              :key="date.ms"
              v-bind="getModifiers(date)"
              :date="date"
              @click.native="onDateSelect(date)"
              @mouseover.native="onDateMouseOver(date)"
              @mouseout.native="onDateMouseOut"
            />
          </div>
        </div>
      </div>
    </RenderlessCalendar>
  </div>
</template>

<script>
  import CalendarCell from './CalendarCell.vue';

  export default {
    name: 'Calendar',
    components: {
      CalendarCell
    },
    props: {
      locale: String 
    },
    data() {
      return {
        minDate: '2019-06-01',
        maxDate: '2020-06-26',
        disabledDates: ['2019-05-30', '2019-06-12', '2019-06-20'],
        isOpened: false
      };
    },
    computed: {
      firstDayOfWeek() {
        return this.locale === 'en' ? 0 : 1;
      }
    },
    methods: {
      handleDateChange(payload) {
      },
      close() {
        window.removeEventListener('keydown', this.keydownHandler);
        this.isOpened = false;
      },
      open() {
        window.addEventListener('keydown', this.keydownHandler);
        this.isOpened = true;
      },
      keydownHandler(e) {
        if (e.code === 'Escape') {
          this.close();
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  $cell-width: 40px;
  $cell-height: 40px;
  $light-gray: #f7f7f9;
  
  .root {
    display: none;
  }

  .infinite-calendar {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #fff;
    border-radius: 5px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    position: relative;
    
    color: #383838;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      will-change: transform;
      background-color: white;
      z-index: -1;
    }
  }
  
  .calendar {
    width: calc(#{$cell-width} * 7);
    padding: 8px;
    
    &__header {
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
    }
    
    &__weeks {
      display: flex;
      justify-content: flex-start;
    }
    
    &__week-day {
      display: inline-block;
      width: $cell-width;
      height: 40px;
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 600;
      line-height: 40px;
    }
    
    &__body {
      max-width: calc(#{$cell-width} * 7);
      min-width: calc(#{$cell-width} * 7);
      justify-content: flex-start;
      display: flex;
      flex-wrap: wrap;
    }
    
    &__month-btn {
      background-color: $light-gray;
      color: #383838;
      border: none;
      border-radius: 3px;
      appearance: none;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      background-image: url('../assets/arrow-point-to-right.svg');
      background-size: 12px;
      background-position: center;
      background-repeat: no-repeat;
      width: 50px;
      height: 30px;
      
      &:first-child {
        transform: rotate(-180deg);
      }
      
      &:focus {
        outline: none;
        background-color: darken($light-gray, 10%);
      }
    }
    
  }


</style>
