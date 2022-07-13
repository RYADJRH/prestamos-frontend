<script setup lang="ts">
import { ref } from 'vue';
import { isActiveDark } from '@/utils/darkMode';
import ParticlesCustom from "@/components/shared_components/ParticlesCustom.vue";
import colors from 'tailwindcss/colors';

const bgColor = isActiveDark() ? ref(colors.gray[800]) : ref(colors.sky[900]);
const particlesColor = isActiveDark() ? ref(colors.gray[400]) : ref(colors.white);


</script>
<template>
    <div>
        <particles-custom :bgColor="bgColor" :particlesColor="particlesColor"></particles-custom>
        <slot />
    </div>
</template>