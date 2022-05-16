import { defineStore } from 'pinia';
import { apiTotalsAmounts } from '@/servicesApi/home.service';

interface State {
    totalAmounts: {
        amount_borrow: number,
        amount_interest: number,
        amount_borrow_interest: number,
        amount_charged: number,
        amount_in_proccess: number,
        amount_un_paid: number
    }
}

const useHomeStore = defineStore('home', {
    state: (): State => ({
        totalAmounts: {
            amount_borrow: 0,
            amount_interest: 0,
            amount_borrow_interest: 0,
            amount_charged: 0,
            amount_in_proccess: 0,
            amount_un_paid: 0
        }
    }),
    getters: {
        getTotalAmounts(state) {
            return state.totalAmounts;
        }
    },
    actions: {
        async getApiTotalAmounts(id_beneficiary: number) {
            return await apiTotalsAmounts(id_beneficiary)
                .then((response) => {
                    const amounts = response.data.totalAmounts;
                    this.totalAmounts = amounts;
                    return Promise.resolve(amounts);
                }).catch((err) => {
                    return Promise.reject(err);
                });

        }
    }
})

export {
    useHomeStore
}