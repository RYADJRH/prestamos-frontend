// import Cookies from 'js-cookie';
// Cookies.set('foo', 'bar')

import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core'
import { User, Login } from '@/interfaces/auth.interface';
import { apiLogin, apiUser } from '@/servicesApi/auth.service';

const userLocal = useStorage('user', null as User | null).value;
const isAuthenticatedLocal = Boolean(userLocal);
const profileBeneficiaryIdLocal = useStorage('profile-id', null as number | null).value;

interface State {
    user: User | null,
    profileBeneficiaryId: number | null,
    isFirstPage: boolean,
    isAuthenticated: boolean,
}

export const useAuthStore = defineStore('auth', {
    state: (): State => ({
        user: userLocal,
        isAuthenticated: isAuthenticatedLocal,
        isFirstPage: true,
        profileBeneficiaryId: profileBeneficiaryIdLocal,
    }),
    getters: {
        userAuthenticated: (state) => state.user,
    },
    actions: {
        setProfileId(beneficiaryId: number | null) {
            this.profileBeneficiaryId = beneficiaryId
            useStorage('profile-id', beneficiaryId).value = beneficiaryId;
        },
        updateStateUser(user: User | null) {
            this.user = user;
            this.isAuthenticated = Boolean(user);
            useStorage('user', user).value = user;
            if (!user)
                this.setProfileId(null);

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