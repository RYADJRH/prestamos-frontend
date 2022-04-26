import { defineStore } from 'pinia';
import { apiGetGroup } from '@/servicesApi/individualGroup.service';
import { Group } from '@/interfaces/group.interface';

interface State {
    group: Group | {},
    amounts: {
        number_members: number,
        amount_charged: number,
        amount_borrow: number,
        amount_interest: number,
        amount_total: number
    }
}

const useIndividualGroupStore = defineStore('individual-group', {
    state: (): State => ({
        group: {},
        amounts: {
            number_members: 0,
            amount_charged: 0,
            amount_borrow: 0,
            amount_interest: 0,
            amount_total: 0
        }
    }),
    getters: {
        getGroup(state) {
            return state.group;
        },
        getAmountsGroup(state) {
            return state.amounts;
        }
    },
    actions: {
        async getApiGroup(slug_group: string) {
            return await apiGetGroup(slug_group)
                .then((response) => {
                    const data = response.data;
                    this.group = data.group;
                    this.amounts = {
                        number_members: data.number_members,
                        amount_charged: data.amount_charged,
                        amount_borrow: data.amount_borrow,
                        amount_interest: data.amount_interest,
                        amount_total: data.amount_total
                    }
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        }
    }
});

export {
    useIndividualGroupStore
}