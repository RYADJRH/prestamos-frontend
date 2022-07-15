<script setup lang="ts">
import { computed } from 'vue';
import colors from 'tailwindcss/colors';
import { ItemSidebar } from '@/interfaces/sidebar.interface';
import Navbar from '@/components/shared_components/Navbar.vue';
import Isotipo from '@/components/logos/Isotipo.vue';
import SidebarItem from './sidebarElements/SidebarItem.vue';

import { useDarkModeStore } from '@/stores/darkMode.store';
const darkModeStore = useDarkModeStore();
const color = computed<string>(() => darkModeStore.dark ? colors.gray[400] : colors.sky[900])


withDefaults(defineProps<{
    menu: Array<ItemSidebar>,
    collapse?: boolean
}>(), {
    collapse: false
})

</script>
<template>
    <div class="flex h-screen overflow-hidden bg-sky-900/5 dark:bg-gray-900">
        <div class="flex h-full">
            <div class="z-[50] fixed bg-black inset-0 opacity-20 block md:hidden transition-opacity" v-show="collapse"
                @click="$emit('toogleSidebar')"></div>
            <div :class="{ '-ml-60': !collapse, 'ml-0': collapse }"
                class="w-52 p-2 z-[60] overflow-y-auto absolute md:relative inset-y-0 left-0  border-r  bg-white  transition-all duration-300 ease-in-out dark:bg-gray-900 dark:border-r-gray-400">
                <div class="flex justify-center">
                    <isotipo :color="color" class="h-32 w-32"></isotipo>
                </div>
                <div class="border-t border-gray-300 dark:border-gray-800"></div>
                <h5 class="p-2 mb-2 text-red-800 font-bold dark:text-white dark:font-normal">Menu</h5>
                <ul>
                    <sidebar-item v-for="item in menu" :item="item" class="mb-1"></sidebar-item>
                </ul>
            </div>
        </div>
        <main class="flex flex-col flex-1 w-full overflow-x-hidden overflow-y-auto">
            <navbar @toogle-sidebar="$emit('toogleSidebar')"></navbar>
            <div class="p-4 md:px-12 md:py-5">
                <slot name="content"></slot>
            </div>
        </main>
    </div>
</template>