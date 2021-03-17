<template>
  <div id="app">
    <div class="flex">
      <section>
        <p>
          Localized with <i>.toLocalString()</i>
          <span class="flex buttons">
            <button
              v-for="loc in ['fr', 'de', 'es', 'en', 'pl']"
              :key="loc"
              :class="{active: loc === customLocale}"
              @click="customLocale = loc"
            >
              {{ loc }}
            </button>
            <input v-model="customLocale">
          </span>
        </p>
        <Calendar :locale="customLocale" />
      </section>
      <section>
        <p>
          Hard-coded locale <i>(backward-compatible)</i>
          <pre>/lib/locale/ru.js</pre>
        </p>
        <Calendar :locale="hardcodedLocale" />
      </section>
    </div>
    <section>
      <DoubleCalendar :locale="customLocale" />
    </section>
    <section>
      <InfiniteCalendar locale="de-DE" />
    </section>
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue';
import DoubleCalendar from './components/DoubleCalendar.vue';
import InfiniteCalendar from './components/InfiniteCalendar.vue';
import localeRu from '../lib/locale/ru';

export default {
  name: 'App',
  components: {
    InfiniteCalendar,
    DoubleCalendar,
    Calendar
  },
  data: () => ({
    hardcodedLocale: localeRu,
    customLocale: 'hu'
  })
};
</script>

<style lang="scss">
#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
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
  background: rgba(0, 0, 0, 0.1);
}
.flex {
  display: flex;
  align-items: flex-start;
}
pre,
.buttons {
  display: block;
  margin: 10px 0;
  height: 20px;
}
section {
  margin: 20px;
}
</style>
