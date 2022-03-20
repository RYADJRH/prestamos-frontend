import { defineStore } from 'pinia';
import { Beneficiary } from '@/interfaces/beneficiary.interface';

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
        
    }

});