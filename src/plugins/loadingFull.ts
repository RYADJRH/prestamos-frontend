
import { App, ref } from 'vue';
const loading = {
    install(app: App) {
        const loadingFull = ref(false);
        function setLoadingFull(value: boolean) {
            loadingFull.value = value;
        }
        app.provide('loading-full', loadingFull)
        app.provide('set-loading-full', setLoadingFull)
    }
}
export { loading };