import axios from 'axios';
import { Payment } from '@/interfaces/utils/Payment.interface';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;


const apiPaymentsPastDue = async (slug_group: string, page: number = 1, search: string = '') => {
    return await axios.get(`${PREFIX_API}payments/past-due/group/${slug_group}?page=${page}&search=${search}`);
}

const apiReportePaymentsPastDueGroup = async (slug_group: string) => {
    const url = `${PREFIX_API}reports/payments/past-due/group/${slug_group}`
    return await axios({
        method: 'GET',
        url,
        responseType: 'blob',
        headers: {
            Accept: 'application/pdf',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
}

const apiPaymentsNextDue = async (slug_group: string, page: number = 1, search: string = '') => {
    return await axios.get(`${PREFIX_API}payments/next-due/group/${slug_group}?page=${page}&search=${search}`);
}

const apiReportePaymentsNextDueGroup = async (slug_group: string) => {
    const url = `${PREFIX_API}reports/payments/next-due/group/${slug_group}`
    return await axios({
        method: 'GET',
        url,
        responseType: 'blob',
        headers: {
            Accept: 'application/pdf',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
}

const apiPaymentsBorrower = async (slug_group: string, slug_borrower: string, page: number = 1) => {
    return await axios.get(`${PREFIX_API}payments/group/${slug_group}/borrower/${slug_borrower}?page=${page}`);
}

const apiPaymentsBorrowerPersonalLoan = async (slug_borrower: string, id_borrow: number, page: number = 1) => {
    return await axios.get(`${PREFIX_API}payments/personal-loans/${slug_borrower}/${id_borrow}?page=${page}`);
}

const apiReportePaymentsBorrowerGroup = async (slug_group: string, slug_borrower: string) => {
    const url = `${PREFIX_API}reports/payments/group/${slug_group}/borrower/${slug_borrower}`
    return await axios({
        method: 'GET',
        url,
        responseType: 'blob',
        headers: {
            Accept: 'application/pdf',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
}

const apiReportePaymentsBorrowerPersonalLoan = async (slug_borrower: string, id_borrow: number) => {
    const url = `${PREFIX_API}reports/payments/personal-loans/borrower/${slug_borrower}/${id_borrow}`
    return await axios({
        method: 'GET',
        url,
        responseType: 'blob',
        headers: {
            Accept: 'application/pdf',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
}

const apiReportePaymentsBeneficiaryPersonalLoan = async (beneficiary: number, date: string, status: string) => {
    const statusUri = status !== '' ? `&status=${status}` : '';
    const url = `${PREFIX_API}reports/payments/personal-loans/beneficiary/${beneficiary}?date=${date}${statusUri}`
    return await axios({
        method: 'GET',
        url,
        responseType: 'blob',
        headers: {
            Accept: 'application/pdf',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
}


const apiUpdateStatePayment = async (type: string, id_payment: number, status: Payment) => {
    return await axios.post(`${PREFIX_API}payments/update-state`, { type, id_payment, status })
}



export {
    apiPaymentsPastDue,
    apiUpdateStatePayment,
    apiReportePaymentsPastDueGroup,
    apiPaymentsNextDue,
    apiReportePaymentsNextDueGroup,
    apiPaymentsBorrower,
    apiReportePaymentsBorrowerGroup,
    apiPaymentsBorrowerPersonalLoan,
    apiReportePaymentsBorrowerPersonalLoan,
    apiReportePaymentsBeneficiaryPersonalLoan
}