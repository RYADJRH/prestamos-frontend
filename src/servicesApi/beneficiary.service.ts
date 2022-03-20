import axios from 'axios';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiGetBeneficiarys = async () => {
    return await axios.get(`${PREFIX_API}beneficiary`);
}

export {
    apiGetBeneficiarys
}