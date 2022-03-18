
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router';
import Particles from "particles.vue3";
import ResolveLayout from "@/layouts/ResolveLayout.vue";
import '@/style/index.css'
import axios from './plugins/axios';
import VueAxios from 'vue-axios';

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueAxios, axios)
    .use(Particles)
    .component('ResolveLayout', ResolveLayout)
    .mount('#app')
