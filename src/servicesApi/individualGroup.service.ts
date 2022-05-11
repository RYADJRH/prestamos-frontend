import axios from 'axios';
import { AddMember, CalculatedAmortization } from '@/interfaces/groupBorrower.interface';
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

const apiDeleteMemberGroup = async (id_group_borrower: number) => {
    return await axios.delete(`${PREFIX_API}group/member/${id_group_borrower}`);
}

const apiCalculatedAmortization = async (data: CalculatedAmortization) => {
    return await axios.post(`${PREFIX_API}amortization/group/calculated`, data);
}

const apiUpdateStateGroup = async (slug_group: string, state_archived_group: boolean) => {
    return await axios.put(`${PREFIX_API}group/update-state/${slug_group}`, { state_archived_group });
}


export {
    apiGetGroup,
    apiGetBorrowerGroup,
    apiAddMemberGroup,
    apiDeleteMemberGroup,
    apiCalculatedAmortization,
    apiUpdateStateGroup
}