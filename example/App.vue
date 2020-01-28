<template>
  <div id="app">
    <section>
      <Calendar />
    </section>
    <section>
      <DoubleCalendar />
    </section>
    <section>
      <InfiniteCalendar />
    </section>
  </div>
</template>

<script>
  import Calendar from './components/Calendar.vue';
  import DoubleCalendar from './components/DoubleCalendar.vue';
  import InfiniteCalendar from './components/InfiniteCalendar.vue';

  export default {
    name: 'App',
    components: {
      InfiniteCalendar,
      DoubleCalendar,
      Calendar
    }
  };
</script>

<style lang="scss">
  #app {
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  html {
    background: rgba(0, 0, 0, .1);
  }
  
  section {
    margin: 20px;
  }
</style>
