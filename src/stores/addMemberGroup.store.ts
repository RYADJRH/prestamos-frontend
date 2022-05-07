import { defineStore } from 'pinia';
import { apiGetBorrowersAddGroup } from '@/servicesApi/borrower.service';
import { apiAddMemberGroup, apiCalculatedAmortization } from '@/servicesApi/individualGroup.service';
import { BorrowerGroupResponse } from '@/interfaces/borrower.interface';
import { AddMember, Amortization, CalculatedAmortization } from '@/interfaces/groupBorrower.interface';

interface State {
    borrowersListSearch: BorrowerGroupResponse[],
    amortization: Amortization[]
}
const useAddMemberGroup = defineStore('add-member-group', {
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
        async listBorrowers(search: string, slug_group: string) {
            return await apiGetBorrowersAddGroup(1, search, slug_group)
                .then((response) => {
                    const data = response.data.borrowers;
                    this.borrowersListSearch = data.data as BorrowerGroupResponse[];
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async addMember(data: AddMember) {
            return await apiAddMemberGroup(data)
                .then((response) => {
                    const member = response.data.member;
                    return Promise.resolve(member);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        setAmortization(data: Amortization[]) {
            this.amortization = data;
        },
        async calculatedAmortization(data: CalculatedAmortization) {
            return await apiCalculatedAmortization(data)
                .then((response) => {
                    const amortizationResponse = response.data.amortization;
                    this.amortization = amortizationResponse;
                    return Promise.resolve(amortizationResponse);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        }
    }
});

export {
    useAddMemberGroup
}