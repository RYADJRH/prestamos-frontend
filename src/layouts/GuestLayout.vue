<script setup lang="ts">

import { ref } from 'vue';
import Particles from "@/components/shared_components/Particles.vue";
import colors from 'tailwindcss/colors';
const bgColor = ref(colors.sky[900]);
const particlesColor = ref(colors.white);

</script>
<template>
    <div>
        <Particles :bgColor="bgColor" :particlesColor="particlesColor"></Particles>
        <slot />
    </div>
</template>