import { defineStore } from "pinia";
import { User, Login } from '@/interfaces/auth.interface';
import { apiLogin, apiUser } from '@/servicesApi/auth.service';
// import Cookies from 'js-cookie';
// Cookies.set('foo', 'bar')

interface State {
    user: User | null,
    profileBeneficiaryId: string | null,
    isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): State => ({
        user: null,
        profileBeneficiaryId: null,
        isAuthenticated: true,
    }),
    getters: {
        user_authenticated: (state) => state.user,
    },
    actions: {
        updateStateUser(user: User) {
            this.user = user;
            this.isAuthenticated = Boolean(user);
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
                .catch(() => {
                    this.user = null;
                    this.isAuthenticated = false;
                    this.profileBeneficiaryId = null;
                });
        }
    }
});