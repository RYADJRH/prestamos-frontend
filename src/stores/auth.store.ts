import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core'
import { User, Login } from '@/interfaces/auth.interface';
import { apiLogin, apiUser, apiLogout } from '@/servicesApi/auth.service';
import { Beneficiary } from '@/interfaces/beneficiary.interface';

const userLocal = useStorage('user', null as User | null).value;
const isAuthenticatedLocal = Boolean(userLocal);
const profileBeneficiaryIdLocal = useStorage('profileBeneficiary', null as string | null).value;
const profileBeneficiaryJson = JSON.parse(profileBeneficiaryIdLocal as string);

interface State {
    user: User | null,
    profileBeneficiary: Beneficiary | null,
    isFirstPage: boolean,
    isAuthenticated: boolean,
}

export const useAuthStore = defineStore('auth', {
    state: (): State => ({
        user: userLocal,
        isAuthenticated: isAuthenticatedLocal,
        isFirstPage: true,
        profileBeneficiary: profileBeneficiaryJson,
    }),
    getters: {
        userAuthenticated: (state) => state.user,
        profileId: (state) => state.profileBeneficiary?.id_beneficiary as number
    },
    actions: {
        setProfileBeneficiary(beneficiary: Beneficiary | null) {
            this.profileBeneficiary = beneficiary
            useStorage('profileBeneficiary', beneficiary).value = beneficiary;
        },
        updateStateUser(user: User | null) {
            this.user = user;
            this.isAuthenticated = Boolean(user);
            useStorage('user', user).value = user;
            if (!user)
                this.setProfileBeneficiary(null);

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
        },
        async logout() {
            return await apiLogout()
                .then((response) => {
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                }).finally(() => {
                    this.updateStateUser(null);
                })
        }
    }
});