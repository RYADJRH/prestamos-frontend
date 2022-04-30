import { defineStore } from 'pinia';
import { apiGetGroup, apiGetBorrowerGroup, apiDeleteMemberGroup, apiGetPayslips, apiDeletePayslip } from '@/servicesApi/individualGroup.service';
import { Group } from '@/interfaces/group.interface';
import { BorrowerAmounts } from '@/interfaces/groupBorrower.interface';
import { Payslip } from '@/interfaces/payslipGroup.interface';

interface State {
    group: Group | {},
    amounts: {
        number_members: number,
        amount_charged: number,
        amount_borrow: number,
        amount_interest: number,
        amount_total: number
    }
    borrowers: {
        data: BorrowerAmounts[],
        currentPage: number,
        totalPages: number,
        totalBorrowers: number;
    },
    payslips: {
        data: Payslip[],
        currentPage: number,
        totalPages: number,
        totalPayslips: number;
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
        },
        borrowers: {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalBorrowers: 0
        },
        payslips: {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalPayslips: 0
        },
    }),
    getters: {
        getGroup(state) {
            return state.group;
        },
        /* members */
        getBorrowersAmount(state) {
            return state.borrowers.data;
        },
        getAmountsGroup(state) {
            return state.amounts;
        },
        getTotalPagesBorrower(state) {
            return state.borrowers.totalPages;
        },
        getCurrentPageBorrower(state) {
            return state.borrowers.currentPage;
        },
        /* payslip */
        getPayslips(state) {
            return state.payslips.data;
        },
        getTotalPagesPaylips(state) {
            return state.payslips.totalPages;
        },
        getCurrentPagePaylips(state) {
            return state.payslips.currentPage;
        }
    },
    actions: {
        /* members */
        setUpdateMember(member: any) {
            const newData: BorrowerAmounts = {
                id_borrower: member.id_borrower,
                id_group: member.group_borrower.id_group,
                id_group_borrower: member.group_borrower.id_group_borrower,
                full_name: member.full_name,
                amount_borrow: member.group_borrower.amount_borrow_decimal,
                amount_interest: member.group_borrower.amount_interest_decimal,
                amount_pay: member.group_borrower.amount_pay_decimal,
                amount_payment_total: member.group_borrower.amount_payment_total_decimal,
                state_borrow: member.group_borrower.state_borrow,
            }
            const index = this.borrowers.data.findIndex((item) => item.id_group_borrower == newData.id_group_borrower);
            if (index != -1) {
                this.borrowers.data[index] = newData;
            }
        },
        setMember(member: any) {
            const newData: BorrowerAmounts = {
                id_borrower: member.id_borrower,
                id_group: member.group_borrower.id_group,
                id_group_borrower: member.group_borrower.id_group_borrower,
                full_name: member.full_name,
                amount_borrow: member.group_borrower.amount_borrow_decimal,
                amount_interest: member.group_borrower.amount_interest_decimal,
                amount_pay: member.group_borrower.amount_pay_decimal,
                amount_payment_total: member.group_borrower.amount_payment_total_decimal,
                state_borrow: member.group_borrower.state_borrow,
            }
            this.borrowers.totalBorrowers++;
            if (this.borrowers.data.length == 5) {
                this.borrowers.data.pop();
            }
            this.borrowers.data.unshift(newData);
            this.borrowers.totalPages = Math.ceil(this.borrowers.totalBorrowers / 5);

        },
        setPageBorrower(page: number) {
            this.borrowers.currentPage = page;
        },
        setTotalPageBorrower(pages: number) {
            this.borrowers.totalPages = pages;
        },
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
        },

        async getApiBorrowersGroup(slug_group: string, page: number, search: string) {
            return await apiGetBorrowerGroup(slug_group, page, search)
                .then((response) => {
                    const borrowers = response.data.borrowers;
                    this.borrowers.currentPage = borrowers.current_page;
                    this.borrowers.totalPages = borrowers.last_page;
                    this.borrowers.totalBorrowers = borrowers.total;

                    this.borrowers.data = borrowers.data.map((borrower: any) => {
                        const newData: BorrowerAmounts = {
                            id_borrower: borrower.id_borrower,
                            id_group: borrower.group_borrower.id_group,
                            id_group_borrower: borrower.group_borrower.id_group_borrower,
                            full_name: borrower.full_name,
                            amount_borrow: borrower.group_borrower.amount_borrow_decimal,
                            amount_interest: borrower.group_borrower.amount_interest_decimal,
                            amount_pay: borrower.group_borrower.amount_pay_decimal,
                            amount_payment_total: borrower.group_borrower.amount_payment_total_decimal,
                            state_borrow: borrower.group_borrower.state_borrow,
                        }
                        return newData;
                    })
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async deleteApiBorrowerGroup(id_group_borrower: number) {
            return await apiDeleteMemberGroup(id_group_borrower)
                .then((response) => {
                    const isDeleted = response.data.isDeleted;
                    if (isDeleted) {
                        this.borrowers.totalBorrowers--;
                        const newData = [...this.borrowers.data].filter((item) => item.id_group_borrower !== id_group_borrower)
                        this.borrowers.data = newData;

                        if (this.borrowers.data.length == 0 && this.borrowers.totalPages > 1) {
                            this.setPageBorrower(1);
                        }
                    }
                    return Promise.resolve(isDeleted);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        /* payslips */
        setPagePayslips(page: number) {
            this.payslips.currentPage = page;
        },
        setTotalPagePayslips(pages: number) {
            this.payslips.totalPages = pages;
        },
        setPayslip(payslip: Payslip) {
            this.payslips.totalPayslips++;
            if (this.payslips.data.length == 5) {
                this.payslips.data.pop();
            }
            this.payslips.data.unshift(payslip);
            this.payslips.totalPages = Math.ceil(this.payslips.totalPayslips / 5);
        },
        setUpdatePayslip(payslip: Payslip) {

            const index = this.payslips.data.findIndex((item) => item.id_payslip == payslip.id_payslip);
            if (index != -1) {
                this.payslips.data[index] = payslip;
            }

        },
        async getApiPayslip(slug_group: string, page: number = 1, search: string = '') {
            return await apiGetPayslips(slug_group, page, search)
                .then((response) => {
                    const payslips = response.data.payslips;
                    this.payslips.currentPage = payslips.current_page;
                    this.payslips.totalPages = payslips.last_page;
                    this.payslips.totalPayslips = payslips.total;
                    this.payslips.data = payslips.data;
                    return Promise.resolve();
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        async deletePayslipGroup(id_payslip: number) {
            return await apiDeletePayslip(id_payslip)
                .then((response) => {
                    const isDeleted = response.data.isDeleted;
                    if (isDeleted) {
                        this.payslips.totalPayslips--;
                        const newData = [...this.payslips.data].filter((item) => item.id_payslip !== id_payslip)
                        this.payslips.data = newData;
                        if (this.payslips.data.length == 0 && this.payslips.totalPages > 1) {
                            this.setPagePayslips(1);
                        }
                    }
                    return Promise.resolve(isDeleted);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },



    }
});

export {
    useIndividualGroupStore
}