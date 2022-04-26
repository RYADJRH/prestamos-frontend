import { defineStore } from 'pinia';
import { apiSaveBorrower, apiGetBorrowers, apiDeleteBorrower, apiUpdateBorrower } from '@/servicesApi/borrower.service';
import { Borrower, BorrrowerRequest } from '@/interfaces/borrower.interface';


interface State {
    currentPage: number,
    totalPages: number,
    borrowers: BorrrowerRequest[],
    totalBorrowers: number;
}

export const UseBorrowerStore = defineStore('borrower', {
    state: (): State => ({
        currentPage: 1,
        totalPages: 1,
        borrowers: [],
        totalBorrowers: 0
    }),
    getters: {
        getBorrowers: (state) => state.borrowers
    },
    actions: {
        setPage(page: number) {
            this.currentPage = page;
        },
        setTotalPage(numPages: number) {
            this.totalPages = numPages;
        },
        async saveBorrower(data: Borrower) {
            return await apiSaveBorrower(data)
                .then((response) => {
                    const data = response.data.borrower as BorrrowerRequest;
                    this.totalBorrowers++;
                    if (this.borrowers.length == 5) {
                        this.borrowers.pop();
                    }
                    this.borrowers.unshift(data);
                    this.totalPages = Math.ceil(this.totalBorrowers / 5);
                    return Promise.resolve(response);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        async listBorrowers(id_beneficiary: number, search: string) {
            return await apiGetBorrowers(id_beneficiary, this.currentPage, search)
                .then((response) => {
                    const data = response.data.borrowers;
                    this.borrowers = data.data as BorrrowerRequest[];
                    this.currentPage = data.current_page as number;
                    this.totalPages = data.last_page as number;
                    this.totalBorrowers = data.total as number;
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async deleteBorrower(id_borrower: number) {
            return await apiDeleteBorrower(id_borrower)
                .then((response) => {
                    const data = response.data.borrower as BorrrowerRequest;
                    const newData = [...this.borrowers].filter((item) => item.id_borrower !== data.id_borrower)
                    this.borrowers = newData;
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async updateBorrower(data: Borrower, id_borrower: number) {
            return await apiUpdateBorrower(data, id_borrower)
                .then((response) => {
                    const data = response.data.borrower as BorrrowerRequest;
                    const index = [...this.borrowers].findIndex((item) => item.id_borrower == data.id_borrower);
                    this.borrowers[index] = data;
                    return Promise.resolve(response)
                }).catch((err) => {
                    return Promise.reject(err)
                });
        }
    }
});