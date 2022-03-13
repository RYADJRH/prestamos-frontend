<script setup lang="ts">
import { shallowRef, watch, defineAsyncComponent } from 'vue';
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { useRoute } from 'vue-router';

const layout = shallowRef(DefaultLayout);
const route = useRoute();

watch(() => route.meta?.layout as String | undefined, async metalayout => {
    try {
        const component = metalayout && await import(/* @vite-ignore */`./${metalayout}.vue`)
        layout.value = component?.default || DefaultLayout;
    } catch (error) {
        layout.value = DefaultLayout;
    }
})

</script>
<template>
    <component :is="layout">
        <slot />
    </component>
</template>