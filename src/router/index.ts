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
        component: () => import('@/views/beneficiarios/Seleccionar.vue'),
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
        component: () => import('@/views/prestatarios/Lista.vue'),
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

    if (errorPage) {
        next();
    } else {
        /*  si la pagina es guest y esta autenticado */
        if (!reqAuth && authStore.isAuthenticated) {
            /* si se selecciono un beneficiario previamente */
            if (authStore.profileBeneficiaryId) {
                return { name: 'home' };
            } else {
                return { name: 'seleccionarBeneficiario' };
            }
        }
    }



    // console.log("hast aqui llego");
    // next();
    // next();
    /*
        if (reqAuth && !authStore.isAuthenticated) {
            await authStore.getUser();
            if (!authStore.isAuthenticated) {
                next({ name: 'login' });
            } else {
                next();
            }
        } else {
            if (!reqAuth && !errorPage && authStore.isAuthenticated) {
                if (authStore.profileBeneficiaryId) {
                    next({ name: 'home' });
                } else {
                    next({ name: 'seleccionarBeneficiario' })
                }
            } else {
                next();
            }
        } */
})


export default router;