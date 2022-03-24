import { defineStore } from 'pinia';
import { Beneficiary } from '@/interfaces/beneficiary.interface';
import { apiGetBeneficiarys, apiRegisterBeneficiary, apiUpdateBeneficiary, apiDeleteBeneficiary } from '@/servicesApi/beneficiary.service';

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
            return await apiGetBeneficiarys()
                .then((response) => {
                    const data = response.data.beneficiarys as Beneficiary[];
                    this.beneficiarys = data;
                })
                .catch(() => { })
        },
        async registerBeneficiary(name_beneficiary: string) {
            return await apiRegisterBeneficiary(name_beneficiary)
                .then((response) => {
                    const beneficiary = response.data.beneficiary as Beneficiary;
                    this.beneficiarys.push(beneficiary);
                    return Promise.resolve(true);
                })
                .catch(() => {
                    return Promise.reject(false);
                })
        },
        async updateBeneficiary(id_beneficiary: number, name_beneficiary: string) {
            return await apiUpdateBeneficiary(id_beneficiary, name_beneficiary)
                .then((response) => {
                    const beneficiary = response.data.beneficiary as Beneficiary;
                    const index = this.beneficiarys.findIndex((item) => item.id_beneficiary == beneficiary.id_beneficiary);
                    if (index !== -1)
                        this.beneficiarys[index].name_beneficiary = beneficiary.name_beneficiary;
                    return Promise.resolve(true);
                })
                .catch(() => {
                    return Promise.reject(false);
                })
        },
        async deleteBeneficiary(id_beneficiary: number) {
            return await apiDeleteBeneficiary(id_beneficiary)
                .then((response) => {
                    const beneficiary = response.data.beneficiary as Beneficiary;
                    this.beneficiarys = [...this.beneficiarys].filter((item) => item.id_beneficiary !== beneficiary.id_beneficiary);
                    return Promise.resolve(true);
                }).catch((err) => {
                    return Promise.reject(false);
                });
        }
    }

});