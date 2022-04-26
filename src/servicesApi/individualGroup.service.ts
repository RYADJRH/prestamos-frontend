import axios from 'axios';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiGetGroup = async (slug_group: string, simple = false) => {
    return await axios.get(`${PREFIX_API}group/slug/${slug_group}?simple=${simple}`)
}

export {
    apiGetGroup
}