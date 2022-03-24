import axios from 'axios';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiGetBeneficiarys = async () => {
    return await axios.get(`${PREFIX_API}beneficiary`);
}
const apiRegisterBeneficiary = async (name_beneficiary: string) => {
    return await axios.post(`${PREFIX_API}beneficiary`, { name_beneficiary })
}
const apiUpdateBeneficiary = async (id_beneficiary: number, name_beneficiary: string) => {
    return await axios.put(`${PREFIX_API}beneficiary/${id_beneficiary}`, { name_beneficiary });
}
const apiDeleteBeneficiary = async (id_beneficiary: number) => {
    return await axios.delete(`${PREFIX_API}beneficiary/${id_beneficiary}`)
}
export {
    apiGetBeneficiarys,
    apiRegisterBeneficiary,
    apiUpdateBeneficiary,
    apiDeleteBeneficiary
}