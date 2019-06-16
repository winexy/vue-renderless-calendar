import Vue from 'vue';
import App from './App.vue';
import { RenderlessCalendar, RenderlessDate } from '../lib';

Vue.config.productionTip = false;

Vue.component('RenderlessCalendar', RenderlessCalendar);
Vue.component('RenderlessDate', RenderlessDate);

new Vue({
  render: h => h(App)
}).$mount('#app');
