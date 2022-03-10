<script setup lang="ts">
import { shallowRef, watch, defineAsyncComponent } from 'vue';
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { useRoute } from 'vue-router';

const layout = shallowRef(DefaultLayout);
const route = useRoute();

watch(() => route.meta, meta => {
    const component = defineAsyncComponent(() =>
        import(`../layouts/${meta.layout}.vue`)
    )
    layout.value = component || DefaultLayout;
})

</script>
<template>
    <component :is="layout">
        <slot />
    </component>
</template>