import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Home from "@/views/Home.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Login,
        meta: {
            layout: 'GuestLayout'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            layout: 'AuthLayout'
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router;