
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Application from './App.vue'
import router from './router';
/* @ts-ignore */
import Particles from "particles.vue3";
import ResolveLayout from "@/layouts/ResolveLayout.vue";
import '@/style/index.css'
import axios from './plugins/axios';
import VueAxios from 'vue-axios';
import { loading } from './plugins/loadingFull';

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
app.component('ResolveLayout', ResolveLayout)
app.mount('#app')

