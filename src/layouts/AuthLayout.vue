<script setup lang="ts">
import Sidebar from '@/components/shared_components/sidebar/Sidebar.vue';
import { ref } from 'vue';
import { CashIcon, HomeIcon, UserGroupIcon, UserIcon } from '@heroicons/vue/outline'

const collapse = ref(true);

const menu = ref([
    {
        link: '/home',
        title: 'Inicio',
        icon: HomeIcon
    },
    {
        title: 'Prestatarios',
        icon: UserIcon,
        subMenu: [
            {
                link: '/prestatarios/lista',
                title: 'Lista',
            },
            {
                link: '/prestatarios/agregar',
                title: 'Agregar',
            },
        ]
    },
    {
        link: '/grupos',
        title: 'Grupos',
        icon: UserGroupIcon
    },
    {
        link: '/prestamos',
        title: 'Prestamos',
        icon: CashIcon
    },

]);
</script>
<template>
    <sidebar :collapse="collapse" :menu="menu" @toogle-sidebar="collapse = !collapse">
        <template #content>
            <slot></slot>
        </template>
    </sidebar>
</template>