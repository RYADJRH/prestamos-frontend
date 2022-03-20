// import Cookies from 'js-cookie';
// Cookies.set('foo', 'bar')

import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core'
import { User, Login } from '@/interfaces/auth.interface';
import { apiLogin, apiUser } from '@/servicesApi/auth.service';

const userLocal = useStorage('user', null as User | null).value;
const isAuthenticatedLocal = Boolean(userLocal);

interface State {
    user: User | null,
    profileBeneficiaryId: string | null,
    isFirstPage: boolean,
    isAuthenticated: boolean,
}

export const useAuthStore = defineStore('auth', {
    state: (): State => ({
        user: userLocal,
        isAuthenticated: isAuthenticatedLocal,
        isFirstPage: true,
        profileBeneficiaryId: null,
    }),
    getters: {
        userAuthenticated: (state) => state.user,
    },
    actions: {
        updateStateUser(user: User | null) {
            this.user = user;
            this.isAuthenticated = Boolean(user);
            useStorage('user', user).value = user;
            if (!user)
                this.profileBeneficiaryId = null;

        },
        async login(credentials: Login) {
            return await apiLogin(credentials)
                .then((response) => {
                    const user = response.data.user as User;
                    this.updateStateUser(user);
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async getUser() {
            return await apiUser()
                .then(response => {
                    const user = response.data.user as User;
                    this.updateStateUser(user);
                })
                .catch(() => { });
        }
    }
});