import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'

interface State {
    dark: Boolean
}
export const useDarkModeStore = defineStore('darkmode', {
    state: (): State => ({
        dark: false
    }),
    getters: {
        darkActive: (state) => state.dark
    },
    actions: {
        setModeTheme(modeDark: Boolean) {
            this.dark = modeDark;
            if (this.dark)
                document.querySelector('html')!.classList.add('dark')
            else
                document.querySelector('html')!.classList.remove('dark')
            useStorage('theme-dark', modeDark).value = modeDark
        }
    }
})