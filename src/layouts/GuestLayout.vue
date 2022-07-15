<script setup lang="ts">
import { computed } from 'vue';
import ParticlesCustom from "@/components/shared_components/ParticlesCustom.vue";
import colors from 'tailwindcss/colors';
import { useDarkModeStore } from '@/stores/darkMode.store';


const darkModeStore = useDarkModeStore();
const bgColor = computed<string>(() => darkModeStore.dark ? colors.gray[800] : colors.sky[900])
const particlesColor = computed<string>(() => darkModeStore.dark ? colors.gray[300] : colors.white)


</script>
<template>
    <div>
        <particles-custom :bgColor="bgColor" :particlesColor="particlesColor"></particles-custom>
        <slot />
    </div>
</template>