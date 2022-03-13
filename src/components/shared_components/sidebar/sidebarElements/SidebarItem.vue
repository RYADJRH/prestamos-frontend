<script setup lang="ts">
import { itemSidebar } from '../interfaces/sidebar';
import { ArrowCircleDownIcon } from '@heroicons/vue/outline'

defineProps<{
    item: itemSidebar
}>();

</script>
<template>
    <li v-if="item.subMenu" class="mb-2">
        <button
            class="w-full mb-2 flex items-center p-2 rounded-md text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 active:text-sky-800"
        >
            <component v-if="item.icon" :is="item.icon" class="h-6 w-6"></component>
            <span :class="{ 'ml-5': item.icon, 'ml-11': !item.icon }">{{ item.title }}</span>
            <ArrowCircleDownIcon class="h-6 w-6 ml-auto"></ArrowCircleDownIcon>
        </button>

        <ul class="px-2 py-3 border rounded-md bg-gray-50">
            <li v-for="itemSubMenu in item.subMenu">
                <router-link
                    :to="itemSubMenu.link"
                    class="flex items-center p-2 rounded-md text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 active:text-sky-800"
                >
                    <span class="ml-9">{{ itemSubMenu.title }}</span>
                </router-link>
            </li>
        </ul>
    </li>
    <li v-else class="mb-2">
        <router-link
            :to="item.link"
            class="flex items-center p-2 rounded-md text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 active:text-sky-800"
        >
            <component v-if="item.icon" :is="item.icon" class="h-6 w-6"></component>
            <span :class="{ 'ml-5': item.icon, 'ml-11': !item.icon }">{{ item.title }}</span>
        </router-link>
    </li>
</template>