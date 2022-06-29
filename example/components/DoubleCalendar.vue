<template>
  <RenderlessCalendar
    v-slot="{
      selectedDates,
      currentYear,
      prevPage,
      nextPage,
      weekDayNames,
      monthNames,
      calendar,
      onDateMouseOut,
      onDateMouseOver,
      onDateSelect,
      setMonth,
      monthsList,
      canGoToPrevMonth,
      canGoToNextMonth,
      getModifiers
    }"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    :marked-dates="['2019-05-29']"
    :locale="locale"
    :capture-hover="captureHover"
    :mode="mode"
    prevent-out-of-range
    :first-day-of-week="firstDayOfWeek"
    :default-selected-dates="dates"
    view-mode="double"
    @onDateChange="handleDateChange"
  >
    <div class="root">
      <button @click="toggleMode">{{ mode }}</button>
      <ul class="months-list">
        <li
          v-for="month in monthsList"
          :key="month.id"
          :class="month.isActive ? '--active' : ''"
          @click="setMonth(month)"
        >
          {{ month !== monthsList[monthsList.length - 1] ? month.full : `${month.full}, ${month.year}` }}
        </li>
      </ul>
      <div
        v-for="view in calendar"
        :key="`${view.month}-${view.year}`"
        class="calendar"
        :data-date-1="selectedDates[0] && selectedDates[0].formatted"
        :data-date-2="selectedDates[1] && selectedDates[1].formatted"
      >
        <div class="calendar__header">
          <button v-if="canGoToPrevMonth" class="calendar__month-btn" @click="prevPage"></button>
          <span class="calendar__title" style="text-transform:capitalize">
            {{ monthNames[view.month].full }}, <strong style="font-weight: 800;">{{ view.year }}</strong>
          </span>
          <button v-if="canGoToNextMonth" class="calendar__month-btn" @click="nextPage"></button>
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
        maxDate: '2022-06-26',
        disabledDates: ['2019-05-30', '2019-06-12', '2019-06-20'],
        mode: 'range',
        captureHover: true,
        dates: ['2020-01-30', '2020-02-05']
      };
    },
    computed: {
      firstDayOfWeek() {
        return this.locale === 'en' ? 0 : 1;
      }
    },
    methods: {
      handleDateChange(dates) {
        this.dates = dates.map(date => date.formatted);
      },
      toggleMode() {
        this.mode = this.mode === 'range' ? 'single' : 'range';
        this.captureHover = this.mode === 'range';
      }
    }
  };
</script>

<style scoped lang="scss">
  $cell-width: 40px;
  $cell-height: 40px;
  $light-gray: #f7f7f9;
  
  .root {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #fff;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
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


  .months-list {
    list-style: none;
    padding-left: 10px;
    margin-top: 65px;
    width: 80px;
  }
  
  .months-list > li {
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
      color: lighten(#383838, 30%);
    }
    
    &.--active {
      color: orangered;
    }
  }
 

</style>
