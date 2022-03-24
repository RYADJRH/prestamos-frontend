
import { createApp, provide } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router';
/* @ts-ignore */
import Particles from "particles.vue3";
import ResolveLayout from "@/layouts/ResolveLayout.vue";
import '@/style/index.css'
import axios from './plugins/axios';
import VueAxios from 'vue-axios';
import { loading } from './plugins/loadingFull';

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueAxios, axios)
    .use(Particles)
    .use(loading)
    .component('ResolveLayout', ResolveLayout)
    .mount('#app')

