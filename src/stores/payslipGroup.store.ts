import { defineStore } from 'pinia';
import { apiAddPayslip, apiUpdatePayslip } from '@/servicesApi/individualGroup.service';
import { AddPayslip, Payslip } from '@/interfaces/payslipGroup.interface';


const usePayslipGroupStore = defineStore('payslip', {
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
        }

    }
})

export {
    usePayslipGroupStore
}