import { defineStore } from 'pinia';
import { apiPaymentsPastDue, apiUpdateStatePayment, apiReportePaymentsPastDueGroup } from '@/servicesApi/payments.service';
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
        }
    },
    actions: {
        setCurrentPagePayment(page: number) {
            this.payments.currentPage = page;
        },
        setTotalPagePayments(pages: number) {
            this.payments.totalPages = pages;
        },
        setGroup(group: { slug: string, name: string }) {
            this.group = group;
        },
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
        async updateStatePayment(id_payment: number, status: Payment) {
            return await apiUpdateStatePayment(id_payment, status)
                .then((response) => {
                    const state_payment = response.data.state_payment;
                    const index = [...this.payments.data].findIndex((item) => item.id_payment == id_payment);
                    if (index != -1) {
                        if (state_payment == Payment.paid) {
                            this.payments.data.splice(index, 1);
                        } else {
                            this.payments.data[index].state_payment = state_payment;
                        }

                    }
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
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
        }
    }
});

export { usePaymentStore };