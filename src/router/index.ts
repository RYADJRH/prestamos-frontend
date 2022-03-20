import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
            layout: 'GuestLayout'
        }
    },
    {
        path: '/seleccionar/beneficiario',
        name: 'seleccionarBeneficiario',
        component: () => import('@/views/beneficiarys/Selected.vue'),
        meta: {
            requiresAuth: true,
            layout: 'GuestLayout'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/prestatarios/lista',
        name: 'prestatarios-lista',
        component: () => import('@/views/borrowers/List.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404.vue'),
        meta: {
            errorPage: true,
            layout: 'GuestLayout'
        }
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(async (to, from, next) => {

    const authStore = useAuthStore();
    const reqAuth = to.matched.some((record) => record.meta.requiresAuth);
    const errorPage = to.matched.some((record) => record.meta.errorPage);

    if (authStore.isFirstPage && authStore.isAuthenticated) {
        await authStore.getUser();
    }
    authStore.isFirstPage = false;

    if (errorPage) {
        next();
    } else {
        if (!reqAuth && authStore.isAuthenticated) {
            if (!authStore.profileBeneficiaryId) {
                return next({ name: 'seleccionarBeneficiario' });
            } else {
                return next({ name: 'home' });
            }
        } else if (reqAuth && authStore.isAuthenticated) {
            if (to.name !== 'seleccionarBeneficiario' && !authStore.profileBeneficiaryId) {
                return next({ name: 'seleccionarBeneficiario' });
            }
            return next();
        } else if (!reqAuth && !authStore.isAuthenticated) {
            return next();
        } else if (reqAuth && !authStore.isAuthenticated) {
            return next({ name: 'login' });

        }
    }
})

export default router;