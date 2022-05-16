import axios from 'axios';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiTotalsAmounts = async (id_beneficiary: number) => {
    return await axios.get(`${PREFIX_API}totals-amounts/${id_beneficiary}`);
}
export {
    apiTotalsAmounts
}