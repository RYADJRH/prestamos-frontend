<script setup lang="ts">
import { ref } from 'vue';
import colors from 'tailwindcss/colors';
import { ItemSidebar } from '@/interfaces/sidebar.interface';
import Navbar from '@/components/shared_components/Navbar.vue';
import Isotipo from '@/components/logos/Isotipo.vue';
import SidebarItem from './sidebarElements/SidebarItem.vue';

const color = ref(colors.sky[900]);
withDefaults(defineProps<{
    menu: Array<ItemSidebar>,
    collapse?: boolean
}>(), {
    collapse: false
})

</script>
<template>
    <div class="flex h-screen">
        <div
            class="z-10 fixed bg-black inset-0 opacity-20 block md:hidden transition-opacity"
            v-show="collapse"
            @click="$emit('toogleSidebar')"
        ></div>
        <div
            :class="{ '-ml-60': !collapse, 'ml-0': collapse }"
            class="w-60 p-2 z-30 overflow-y-auto absolute md:relative inset-y-0 left-0 bg-white border-r transition-all duration-300 ease-in-out"
        >
            <div class="flex justify-center">
                <isotipo :color="color" class="h-32 w-32"></isotipo>
            </div>
            <div class="border-t border-gray-300"></div>
            <h5 class="p-2 mb-2 text-red-800 font-bold">Menu</h5>
            <ul>
                <sidebar-item v-for="item in menu" :item="item" class="mb-1"></sidebar-item>
            </ul>
        </div>

        <main class="flex flex-col flex-1">
            <navbar @toogle-sidebar="$emit('toogleSidebar')"></navbar>
            <div class="overflow-y-auto p-4 h-screen bg-gray-50">
                <slot name="content"></slot>
            </div>
        </main>
    </div>
</template>