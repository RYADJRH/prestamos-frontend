import axios from 'axios';
import { CalculatedAmortizationLoans, AddLoans } from '@/interfaces/individualLoans.interface';
import { Payment } from '@/interfaces/utils/Payment.interface';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;


const apiCalculatedAmortizationLoans = async (data: CalculatedAmortizationLoans) => {
    return await axios.post(`${PREFIX_API}amortization/individual/calculated`, data);
}


const apiAmountsLoans = async (id_beneficiary: number) => {
    return await axios.get(`${PREFIX_API}loans/amounts/${id_beneficiary}`);
}

const apiAddLoans = async (data: AddLoans) => {
    return await axios.post(`${PREFIX_API}loans`, data);
}

const apiLoans = async (id_beneficiary: number, page: number = 1, search: string = '', status: Payment) => {
    return await axios.get(`${PREFIX_API}loans/${id_beneficiary}?page=${page}&search=${search}&status=${status}`);
}

const apiDeleteLoan = async (id_borrow: number) => {
    return await axios.delete(`${PREFIX_API}loans/${id_borrow}`);
}


export {
    apiCalculatedAmortizationLoans,
    apiAddLoans,
    apiAmountsLoans,
    apiLoans,
    apiDeleteLoan
}