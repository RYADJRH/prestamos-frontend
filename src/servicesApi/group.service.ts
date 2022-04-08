import axios from 'axios';
import { Group } from '@/interfaces/group.interface';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiListGroup = async (page: number, id_beneficiary: number, inputSearch: string, archived: 0 | 1) => {
    return await axios.get(`${PREFIX_API}group/${id_beneficiary}?page=${page}&search=${inputSearch}&archived=${archived}`);
}
const apiRegisterGroup = async (data: Group) => {
    const { name_group, created_group, day_payment, id_beneficiary } = data;
    return await axios.post(`${PREFIX_API}group`, { name_group, created_group, day_payment, id_beneficiary });
}
const apiDeleteGroup = async (id_group: number) => {
    return await axios.delete(`${PREFIX_API}group/${id_group}`);
}
const apiEditGroup = async (group: Group) => {
    const { name_group, created_group, day_payment, id_beneficiary } = group;
    return axios.put(`${PREFIX_API}group/${group.id_group}`, { name_group, created_group, day_payment, id_beneficiary })
}

export {
    apiListGroup,
    apiRegisterGroup,
    apiDeleteGroup,
    apiEditGroup
}