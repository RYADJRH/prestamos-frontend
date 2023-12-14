import axios from 'axios';
import { useErrorStore } from '@/stores/error.store';
import { useAuthStore } from '@/stores/auth.store';
import { useDialogStore } from '@/stores/dialog.store';
import router from '@/router/index';

axios.defaults.baseURL = import.meta.env.VITE_BASE_API || 'http://localhost/';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
    const dialogStore = useDialogStore();
    switch (error.response.status) {
      case 401:
        authStore.updateStateUser(null);
        break;
      case 403:
        const message = error.response.data.message;
        dialogStore.show({ variant: 'error', title: 'Ha ocurrido un error', description: message });
        break;
      case 422:
        const errors = error.response.data;
        errorStore.$state.errors = errors.errors;
        errorStore.$state.message = errors.message;
        break;
      case 404:
        router.push({ name: 'NotFound' });
        break;
      default:
        console.log(error.response.data);
        break;
    }
    return Promise.reject(error);
  }
);

export default axios;
