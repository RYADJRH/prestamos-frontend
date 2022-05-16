import { defineStore } from 'pinia';
import {
    apiPaymentsPastDue,
    apiUpdateStatePayment,
    apiReportePaymentsPastDueGroup,
    apiPaymentsNextDue,
    apiReportePaymentsNextDueGroup,
    apiPaymentsBorrower,
    apiReportePaymentsBorrowerGroup,
    apiPaymentsBorrowerPersonalLoan,
    apiReportePaymentsBorrowerPersonalLoan
} from '@/servicesApi/payments.service';
import { Payments } from '@/interfaces/payments.interface';
import { Payment } from '@/interfaces/utils/Payment.interface';

interface State {
    payments: {
        data: Payments[],
        currentPage: number,
        totalPages: number,
        totalPayments: number;
    },
    total_owe: number,
    group: {
        slug: string,
        name: String
    },
    borrower: {
        slug: string,
        full_name: string,
        id_borrow?: number
    }
}
const usePaymentStore = defineStore('payments', {
    state: (): State => ({
        payments: {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalPayments: 0
        },
        total_owe: 0,
        group: {
            slug: '',
            name: ''
        },
        borrower: {
            slug: '',
            full_name: '',
            id_borrow: -1
        }

    }),
    getters: {
        getPayments(state) {
            return state.payments.data;
        },
        getCurrentPagePayments(state) {
            return state.payments.currentPage;
        },
        getTotalPagesPayments(state) {
            return state.payments.totalPages;
        },
        getTotalPayments(state) {
            return state.payments.totalPayments;
        },
        getTotalOwe(state) {
            return state.total_owe;
        },
        getGroup(state) {
            return state.group;
        },
        getBorrower(state) {
            return state.borrower;
        }
    },
    actions: {
        setBorrower(borrower: { slug: string, full_name: string, id_borrow?: number }) {
            this.borrower = borrower;
        },
        setCurrentPagePayment(page: number) {
            this.payments.currentPage = page;
        },
        setTotalPagePayments(pages: number) {
            this.payments.totalPages = pages;
        },
        setGroup(group: { slug: string, name: string }) {
            this.group = group;
        },
        /* payments past due */
        async getApiPaymentsPastDue(slug_group: string, page: number, search: string) {
            return await apiPaymentsPastDue(slug_group, page, search)
                .then((response) => {
                    const paymentsResponse = response.data.payments;
                    const totalOwe = response.data.total;
                    const nameGroup = response.data.name_group;
                    this.payments.currentPage = paymentsResponse.current_page;
                    this.payments.totalPages = paymentsResponse.last_page;
                    this.payments.totalPayments = paymentsResponse.total;
                    this.payments.data = paymentsResponse.data;
                    this.total_owe = totalOwe;
                    this.group.name = nameGroup;
                    return Promise.resolve(paymentsResponse);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async reportePaymentsPastDueGroup(slug_group: string) {
            return await apiReportePaymentsPastDueGroup(slug_group)
                .then((response) => {
                    const pdf = response.data;
                    let blob = new Blob([pdf], {
                        type: 'application/pdf'
                    });
                    const url = window.URL.createObjectURL(blob);
                    return Promise.resolve(url);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        /* payments next due */
        async getApiPaymentsNextDue(slug_group: string, page: number, search: string) {
            return await apiPaymentsNextDue(slug_group, page, search)
                .then((response) => {
                    const paymentsResponse = response.data.payments;
                    const totalOwe = response.data.total;
                    const nameGroup = response.data.name_group;
                    this.payments.currentPage = paymentsResponse.current_page;
                    this.payments.totalPages = paymentsResponse.last_page;
                    this.payments.totalPayments = paymentsResponse.total;
                    this.payments.data = paymentsResponse.data;
                    this.total_owe = totalOwe;
                    this.group.name = nameGroup;
                    return Promise.resolve(paymentsResponse);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async reportePaymentsNextDueGroup(slug_group: string) {
            return await apiReportePaymentsNextDueGroup(slug_group)
                .then((response) => {
                    const pdf = response.data;
                    let blob = new Blob([pdf], {
                        type: 'application/pdf'
                    });
                    const url = window.URL.createObjectURL(blob);
                    return Promise.resolve(url);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        /* payments for borrower */
        async getApiPaymentsBorrower(slug_group: string, slug_borrower: string, page: number) {
            return await apiPaymentsBorrower(slug_group, slug_borrower, page)
                .then((response) => {
                    const paymentsResponse = response.data.payments;
                    const totalOwe = response.data.total;
                    const nameBorrower = response.data.name_borrower;
                    const nameGroup = response.data.name_group;
                    this.payments.currentPage = paymentsResponse.current_page;
                    this.payments.totalPages = paymentsResponse.last_page;
                    this.payments.totalPayments = paymentsResponse.total;
                    this.payments.data = paymentsResponse.data;
                    this.total_owe = totalOwe;
                    this.borrower.full_name = nameBorrower;
                    this.group.name = nameGroup;
                    return Promise.resolve(paymentsResponse);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async reportePaymentsBorrowerGroup(slug_group: string, slug_borrower: string) {
            return await apiReportePaymentsBorrowerGroup(slug_group, slug_borrower)
                .then((response) => {
                    const pdf = response.data;
                    let blob = new Blob([pdf], {
                        type: 'application/pdf'
                    });
                    const url = window.URL.createObjectURL(blob);
                    return Promise.resolve(url);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },

        /* Payments for borrower personal loans */

        async getApiPaymentsBorrowerPersonal(slug_borrower: string, id_borrow: number, page: number) {
            return await apiPaymentsBorrowerPersonalLoan(slug_borrower, id_borrow, page)
                .then((response) => {
                    const paymentsResponse = response.data.payments;
                    const totalOwe = response.data.total;
                    const nameBorrower = response.data.name_borrower;

                    this.payments.currentPage = paymentsResponse.current_page;
                    this.payments.totalPages = paymentsResponse.last_page;
                    this.payments.totalPayments = paymentsResponse.total;
                    this.payments.data = paymentsResponse.data;
                    this.total_owe = totalOwe;
                    this.borrower.full_name = nameBorrower;
                    return Promise.resolve(paymentsResponse);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },

        async reportePaymentsBorrowerPersonalLoan(slug_borrower: string, id_borrow: number) {
            return await apiReportePaymentsBorrowerPersonalLoan(slug_borrower, id_borrow)
                .then((response) => {
                    const pdf = response.data;
                    let blob = new Blob([pdf], {
                        type: 'application/pdf'
                    });
                    const url = window.URL.createObjectURL(blob);
                    return Promise.resolve(url);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },


        async updateStatePayment(type: string, id_payment: number, status: Payment) {
            return await apiUpdateStatePayment(type, id_payment, status)
                .then((response) => {
                    const state_payment = response.data.state_payment;
                    const index = [...this.payments.data].findIndex((item) => item.id_payment == id_payment);
                    if (type == 'borrower-payments' || type == 'personal-loans') {
                        this.payments.data[index].state_payment = state_payment;
                        if (state_payment == Payment.paid) {
                            this.total_owe -= this.payments.data[index].amount_payment_period_decimal;
                        }
                        if ((state_payment == Payment.unpaid || state_payment == Payment.inprocess)) {
                            this.total_owe += this.payments.data[index].amount_payment_period_decimal;
                        }
                    } else {
                        if (index != -1) {
                            if (state_payment == Payment.paid) {
                                this.payments.data.splice(index, 1);
                            } else {
                                this.payments.data[index].state_payment = state_payment;
                            }

                        }
                    }
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
    }
});

export { usePaymentStore };