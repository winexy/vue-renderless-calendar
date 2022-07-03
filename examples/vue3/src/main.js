import { createApp } from 'vue';
import App from './App.vue';
import { RenderlessCalendar } from '../dist/index.es';

const app = createApp(App);
app.component('RenderlessCalendar', RenderlessCalendar);
app.mount('#app');
