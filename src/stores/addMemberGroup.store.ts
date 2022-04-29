import { defineStore } from 'pinia';
import { apiGetBorrowersAddGroup } from '@/servicesApi/borrower.service';
import { apiAddMemberGroup, apiUpdateMemberGroup } from '@/servicesApi/individualGroup.service';
import { BorrowerGroupResponse } from '@/interfaces/borrower.interface';
import { AddMember, UpdateMember } from '@/interfaces/groupBorrower.interface';

interface State {
    borrowersListSearch: BorrowerGroupResponse[]
}
const useAddMemberGroup = defineStore('add-member-group', {
    state: (): State => ({
        borrowersListSearch: []
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
        async updateMember(data: UpdateMember) {
            return await apiUpdateMemberGroup(data)
                .then((response) => {
                    const member = response.data.member;
                    return Promise.resolve(member);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        }

    }
});

export {
    useAddMemberGroup
}