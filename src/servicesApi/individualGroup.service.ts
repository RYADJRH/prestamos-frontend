import { AddMember, UpdateMember } from '@/interfaces/groupBorrower.interface';
import { AddPayslip, Payslip } from '@/interfaces/payslipGroup.interface';

import axios from 'axios';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiGetGroup = async (slug_group: string, simple = false) => {
    return await axios.get(`${PREFIX_API}group/slug/${slug_group}?simple=${simple}`)
}

const apiGetBorrowerGroup = async (slug_group: string, page: number = 1, search: string = '') => {
    return await axios.get(`${PREFIX_API}group/members/${slug_group}?page=${page}&search=${search}`)
}

const apiAddMemberGroup = async (data: AddMember) => {
    return await axios.post(`${PREFIX_API}group/member`, data);
}

const apiUpdateMemberGroup = async (data: UpdateMember) => {
    const { amount_borrow, amount_interest } = data;
    return await axios.put(`${PREFIX_API}group/member/${data.id_group_borrower}`, { amount_borrow, amount_interest });
}
const apiDeleteMemberGroup = async (id_group_borrower: number) => {
    return await axios.delete(`${PREFIX_API}group/member/${id_group_borrower}`);
}

const apiGetPayslips = async (slug_group: string, page = 1, search = '') => {
    return await axios.get(`${PREFIX_API}group/payslip/${slug_group}?page=${page}&search=${search}`);
}

const apiAddPayslip = async (data: AddPayslip) => {
    return await axios.post(`${PREFIX_API}group/payslip`, data);
}

const apiUpdatePayslip = async (data: Payslip) => {
    const { name_payslip, created_payslip } = data;
    return await axios.put(`${PREFIX_API}group/payslip/${data.id_payslip}`, { name_payslip, created_payslip });
}

const apiDeletePayslip = async (id_payslip: number) => {
    return await axios.delete(`${PREFIX_API}group/payslip/${id_payslip}`);
}

export {
    apiGetGroup,
    apiGetBorrowerGroup,
    apiAddMemberGroup,
    apiUpdateMemberGroup,
    apiDeleteMemberGroup,
    apiGetPayslips,
    apiAddPayslip,
    apiUpdatePayslip,
    apiDeletePayslip
}