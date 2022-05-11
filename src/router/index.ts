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
        path: '/prestatarios',
        name: 'prestatarios',
        component: () => import('@/views/borrowers/List.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/grupos',
        name: 'grupos',
        component: () => import('@/views/groups/List.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/grupo/:slug',
        name: 'grupo',
        component: () => import('@/views/groups/Grupo.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/grupo/pagos-vencidos/:slug',
        name: 'grupo-pagos-vencidos',
        component: () => import('@/views/groups/payments/PastDue.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/grupo/pagos-siguientes/:slug',
        name: 'grupo-pagos-siguientes',
        component: () => import('@/views/groups/payments/NextDue.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/pagos/grupo/:slug_group/prestatista/:slug_borrower',
        name: 'pagos-borrower',
        component: () => import('@/views/borrowers/payments/PaymentsGroup.vue'),
        meta: {
            requiresAuth: true,
            layout: 'AuthLayout'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),
        meta: {
            errorPage: true,
            layout: 'GuestLayout'
        }
    }

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
            if (!authStore.profileBeneficiary) {
                return next({ name: 'seleccionarBeneficiario' });
            } else {
                return next({ name: 'home' });
            }
        } else if (reqAuth && authStore.isAuthenticated) {
            if (to.name !== 'seleccionarBeneficiario' && !authStore.profileBeneficiary) {
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