<script setup lang="ts">
import { computed } from 'vue';
import { useDarkModeStore } from '@/stores/darkMode.store';

const darkModeStore = useDarkModeStore();
const bgColor = computed<string>(() =>
    !darkModeStore.dark ?
        'from-sky-700 via-sky-700 to-sky-900' : 'from-gray-700 via-gray-700 to-gray-900')


</script>
<template>
    <div class="bg-gradient-to-t" :class="[bgColor]">
        <slot />
    </div>
</template>