<script setup lang="ts">
import { shallowRef, watch, onBeforeMount } from 'vue';
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { useRoute } from "vue-router";

const layout = shallowRef();
const route = useRoute();


watch(
  () => route.meta?.layout as String | undefined,
  async (metalayout) => {
    layout.value = undefined;
    try {
      const component =
        metalayout && (await import(/* @vite-ignore */ `./${metalayout}.vue`));
      layout.value = component?.default || DefaultLayout;
    } catch (error) {
      layout.value = DefaultLayout;
    }
  }
);
</script>
<template>
  <component :is="layout">
    <slot></slot>
  </component>
</template>
