import { defineStore } from 'pinia';
import { apiAddPayslip, apiUpdatePayslip, apiGetPayslip, apiGetPaymentsPayslip, apiGetaddPaymentsMemberPayslip, apiRegisterPaymentsMembers } from '@/servicesApi/individualGroup.service';
import { AddPayslip, PayslipPayments, Payslip } from '@/interfaces/payslipGroup.interface';
import { AddPayment, PaymentsPayslip } from '@/interfaces/payments.interface';

interface State {
    payslip: PayslipPayments,
    payments: {
        data: PaymentsPayslip[],
        currentPage: number,
        totalPages: number,
        totalPayments: number;
    },
    addPayments: AddPayment[],
}

const usePayslipGroupStore = defineStore('payslip', {

    state: (): State => ({
        payslip: {
            id_payslip: -1,
            name_payslip: "",
            created_payslip: "",
            slug: "",
            slug_group: "",
            number_payments: 0,
            amount_payments: 0
        },
        payments: {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalPayments: 0
        },
        addPayments: []
    }),
    getters: {
        getPayslip(state) {
            return state.payslip;
        },
        getPayments(state) {
            return state.payments.data;
        },
        getCurrentPagePayments(state) {
            return state.payments.currentPage;
        },
        getTotalPagesPayments(state) {
            return state.payments.totalPages
        },
        getAddPaymentsMembers(state) {
            return state.addPayments;
        }

    },
    actions: {
        async addPaySlip(data: AddPayslip) {
            return await apiAddPayslip(data)
                .then((response) => {
                    const payslip = response.data.payslip;
                    return Promise.resolve(payslip);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async updatePaySlip(data: Payslip) {
            return await apiUpdatePayslip(data)
                .then((response) => {
                    const payslip = response.data.payslip;
                    return Promise.resolve(payslip);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        },
        async getApiPayslip(slug_payslip: string) {
            return await apiGetPayslip(slug_payslip)
                .then((response) => {
                    const payslipResponse = response.data.payslip;
                    this.payslip = payslipResponse;

                    return Promise.resolve(payslipResponse);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },

        /* payments */
        setPagePayments(page: number) {
            this.payments.currentPage = page;
        },
        setTotalPagePayments(pages: number) {
            this.payments.totalPages = pages;
        },
        async getPaymentsPayslip(slug_payslip: string, page: number, search: string) {
            return await apiGetPaymentsPayslip(slug_payslip, page, search)
                .then((response) => {
                    const paymentsResponse = response.data.payments;
                    this.payments.currentPage = paymentsResponse.current_page;
                    this.payments.totalPages = paymentsResponse.last_page;
                    this.payments.totalPayments = paymentsResponse.total;
                    this.payments.data = paymentsResponse.data;
                    return Promise.resolve(paymentsResponse);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },

        /* add payment */
        setAddPaymentsMembers(value: AddPayment[]) {
            this.addPayments = value;
        },
        async getaddPaymentsMemberPayslip(slug_payslip: string) {
            return await apiGetaddPaymentsMemberPayslip(slug_payslip)
                .then((response) => {
                    const addPaymentsMembers = response.data.addPaymentsMembers;

                    this.addPayments = addPaymentsMembers.map((paymentsMember: any) => {
                        const addPaymentMember: AddPayment = {
                            isSelected: false,
                            id_borrower: paymentsMember.id_borrower,
                            id_group_borrower: paymentsMember.id_group_borrower,
                            full_name: paymentsMember.full_name,
                            amount_payment: 0
                        }
                        return addPaymentMember;
                    })
                    return Promise.resolve(addPaymentsMembers);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        },
        async registerPaymentsMembers(slug_payslip: string, payments: AddPayment[]) {
            return await apiRegisterPaymentsMembers(slug_payslip, payments)
                .then((response) => {

                    return Promise.resolve(response);
                })
                .catch((err) => {
                    return Promise.reject(err);
                })
        }


    }
})

export {
    usePayslipGroupStore
}