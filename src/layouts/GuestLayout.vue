<script setup lang="ts">

import { ref } from 'vue';
import ParticlesCustom from "@/components/shared_components/ParticlesCustom.vue";
import colors from 'tailwindcss/colors';
const bgColor = ref(colors.sky[900]);
const particlesColor = ref(colors.white);

</script>
<template>
    <div>
        <particles-custom :bgColor="bgColor" :particlesColor="particlesColor"></particles-custom>
        <slot />
    </div>
</template>