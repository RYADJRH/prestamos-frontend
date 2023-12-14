import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Application from './App.vue';
import router from './router';
import Particles from 'vue3-particles';
import ResolveLayout from '@/layouts/ResolveLayout.vue';
import axios from './plugins/axios';
import VueAxios from 'vue-axios';
import Datepicker from '@vuepic/vue-datepicker';
import Toast, { PluginOptions } from 'vue-toastification';
import { loading } from './plugins/loadingFull';

import 'vue-toastification/dist/index.css';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/style/index.css';

const options: PluginOptions = {
  transition: 'Vue-Toastification__fade',
  newestOnTop: true,
  timeout: 1500,
};

const app = createApp(Application);

app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.use(Particles);
app.use(loading);
app.use(Toast, options);
app.component('Datepicker', Datepicker);
app.component('ResolveLayout', ResolveLayout);
app.mount('#app');
