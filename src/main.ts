
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Application from './App.vue'
import router from './router';
/* @ts-ignore */
import Particles from "particles.vue3";
import ResolveLayout from "@/layouts/ResolveLayout.vue";
import axios from './plugins/axios';
import VueAxios from 'vue-axios';
import { loading } from './plugins/loadingFull';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import '@/style/index.css'

const app = createApp(Application);

app.directive('focus', {
    mounted(el) {
        el.focus();
    },
})

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(Particles)
app.use(loading)
app.component('Datepicker', Datepicker);
app.component('ResolveLayout', ResolveLayout)
app.mount('#app')

