import { defineStore } from 'pinia';
import { BorrowerAddLoans, CalculatedAmortizationLoans, AmortizationLoans, AddLoans } from '@/interfaces/individualLoans.interface';

import { apiGetBorrowersAddLoans } from '@/servicesApi/borrower.service';
import { apiCalculatedAmortizationLoans, apiAddLoans } from '@/servicesApi/individualLoans.service';

interface State {
    borrowersListSearch: BorrowerAddLoans[],
    amortization: AmortizationLoans[]
}

const useAddLoansStore = defineStore('addLoansStore', {
    state: (): State => ({
        borrowersListSearch: [],
        amortization: []
    }),
    getters: {
        getBorrowerList(state) {
            return state.borrowersListSearch.sort((a, b) => {
                if (a.full_name > b.full_name)
                    return 1;
                if (a.full_name < b.full_name)
                    return -1;
                return 0;
            });
        },
        getAmortization(state) {
            return state.amortization;
        }
    },
    actions: {
        async listBorrowers(search: string, id_beneficiary: number) {
            return await apiGetBorrowersAddLoans(1, search, id_beneficiary)
                .then((response) => {
                    const data = response.data.borrowers;
                    this.borrowersListSearch = data.data as BorrowerAddLoans[];
                    return Promise.resolve(data);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        setAmortization(data: AmortizationLoans[]) {
            this.amortization = data;
        },
        async calculatedAmortizationLoans(data: CalculatedAmortizationLoans) {
            return await apiCalculatedAmortizationLoans(data)
                .then((response) => {
                    const amortizationResponse = response.data.amortization;
                    this.amortization = amortizationResponse;
                    return Promise.resolve(amortizationResponse);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async addLoans(data: AddLoans) {
            return await apiAddLoans(data)
                .then((response) => {
                    const loan = response.data.loan;
                    return Promise.resolve(loan);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
    }
});

export {
    useAddLoansStore
}