import axios from 'axios'


axios.defaults.baseURL = import.meta.env.VITE_BASE_API || "http://localhost/";
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios;