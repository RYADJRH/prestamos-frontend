import { defineStore } from 'pinia';
import { isMobile } from "@/utils/mobile";

interface State {
    collapseSidebar: boolean
}

export const useSidebar = defineStore('sidebar', {
    state: (): State => ({
        collapseSidebar: false
    }),
    getters: {
        isCollapseSidebar: (state) => !state.collapseSidebar
    },
    actions: {
        toogleCollapseSidebar() {
            this.collapseSidebar = !this.collapseSidebar;
        }
    }
})

