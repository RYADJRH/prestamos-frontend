import { defineStore } from 'pinia';
import { Beneficiary } from '@/interfaces/beneficiary.interface';
import { apiGetBeneficiarys } from '@/servicesApi/beneficiary.service';

interface State {
    beneficiarys: Beneficiary[]
}

export const useBeneficiaryStore = defineStore('beneficiary', {
    state: (): State => ({
        beneficiarys: []
    }),
    getters: {
        getBeneficiarys: (state) => state.beneficiarys
    },
    actions: {
        async getBeneficiary() {
            return apiGetBeneficiarys()
                .then((response) => {
                    const data = response.data.beneficiarys as Beneficiary[];
                    this.beneficiarys = data;
                })
                .catch(() => { })
        }
    }

});