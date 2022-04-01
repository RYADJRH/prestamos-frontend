import axios from 'axios';
import { Login } from '@/interfaces/auth.interface';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiLogin = async (credentials: Login) => {
    await axios.get('sanctum/csrf-cookie')
    return axios.post(`${PREFIX_API}user/login`, credentials);
}
const apiUser = async () => {
    return axios.get(`${PREFIX_API}user`);
}

const apiLogout = async () => {
    return await axios.post(`${PREFIX_API}user/logout`);
}

export {
    apiLogin,
    apiUser,
    apiLogout
}