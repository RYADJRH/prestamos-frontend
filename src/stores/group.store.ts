import { defineStore } from 'pinia';
import { Group } from '@/interfaces/group.interface';
import { apiListGroup, apiRegisterGroup, apiDeleteGroup, apiEditGroup } from '@/servicesApi/group.service';
interface State {
    currentPage: number,
    totalPages: number,
    seletecFilter: 0 | 1
    itemsFiltro: Record<'text' | 'value', any>[]
    groups: Group[]
}

const useGroupStore = defineStore('group', {
    state: (): State => ({
        currentPage: 1,
        totalPages: 1,
        seletecFilter: 0,
        itemsFiltro: [
            { text: "En proceso", value: 0 },
            { text: "Archivado", value: 1 },
        ],
        groups: []
    }),
    getters: {
        getGroups(state) {
            return state.groups;
        },
        getitemsFiltro(state) {
            return state.itemsFiltro;
        }
    },
    actions: {
        setPage(page: number) {
            this.currentPage = page;
        },
        setTotalPage(page: number) {
            this.totalPages = page;
        },
        setSeletecFilter(filter: 0 | 1) {
            this.seletecFilter = filter;
        },
        async getListGroups(id_beneficiary: number, inputSearch: string, archived: 0 | 1) {
            return await apiListGroup(this.currentPage, id_beneficiary, inputSearch, archived)
                .then((response) => {
                    const data = response.data.groups;
                    this.currentPage = data.current_page;
                    this.totalPages = data.last_page;
                    this.groups = data.data;
                    return Promise.resolve(response);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        async saveGroup(data: Group) {
            return await apiRegisterGroup(data)
                .then((response) => {
                    const data = response.data.group as Group;
                    if (this.seletecFilter == 0) {
                        if (this.groups.length == 6) {
                            this.groups.pop();
                        }
                        this.groups.unshift(data);
                    }
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async deleteGroup(id_group: number) {
            return await apiDeleteGroup(id_group)
                .then((response) => {
                    const data = response.data.group as Group;
                    const newData = [...this.groups].filter((group) => group.id_group !== data.id_group);
                    this.groups = newData;
                    return Promise.resolve(response);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        async editGroup(group: Group) {
            return await apiEditGroup(group)
                .then((response) => {
                    const data = response.data.group as Group;
                    const index = [...this.groups].findIndex((group) => group.id_group == data.id_group);
                    this.groups[index] = data;
                    return Promise.resolve(response);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        }
    }

});

export {
    useGroupStore
}