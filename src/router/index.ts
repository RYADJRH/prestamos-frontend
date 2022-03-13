import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
            layout: 'GuestLayout'
        }
    },
    {
        path: '/seleccionar/beneficiario',
        name: 'seleccionarBeneficiario',
        component: () => import('@/views/beneficiarios/Seleccionar.vue'),
        meta: {
            layout: 'GuestLayout'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
            layout: 'AuthLayout'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404.vue'),
        meta: {
            layout: 'GuestLayout'
        }
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router;