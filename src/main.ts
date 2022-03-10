import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router';
import '@/style/index.css'
import Particles from "particles.vue3";
import ResolveLayout from "@/layouts/ResolveLayout.vue";

createApp(App)
    .use(createPinia())
    .use(Particles)
    .use(router)
    .component('ResolveLayout', ResolveLayout)
    .mount('#app')
