<script setup lang="ts">
import { markRaw, ref, watch } from 'vue';
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { useRoute } from "vue-router";

const layout = ref();
const route = useRoute();

watch(
  () => route.meta?.layout as String | undefined,
  async (metalayout) => {
    layout.value = undefined;
    try {
      const component =
        metalayout && (await import(`../layouts/${metalayout}.vue`));
      layout.value = markRaw(component?.default || DefaultLayout);
    } catch (error) {
      layout.value = markRaw(DefaultLayout);
    }
  }, { immediate: true }
);
</script>
<template>
  <component :is="layout">
    <slot></slot>
  </component>
</template>
