import axios from 'axios'
import { useErrorStore } from '@/stores/error.store';
import { useAuthStore } from '@/stores/auth.store';

axios.defaults.baseURL = import.meta.env.VITE_BASE_API || "http://localhost/";
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

axios.interceptors.request.use(

    function (config) {
        const errorStore = useErrorStore();
        errorStore.$reset();
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const authStore = useAuthStore();
        const errorStore = useErrorStore();

        switch (error.response.status) {
            case 401:
                authStore.updateStateUser(null);
                break;
            case 422:
                const errors = error.response.data;
                errorStore.$state.errors = errors.errors;
                errorStore.$state.message = errors.message;
                break;
            default:
                console.log(error.response.data);
                break;
        }
        return Promise.reject(error);
    }
)

export default axios;