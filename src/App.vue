<script setup lang="ts">
import RAlert from "@/components/shared_components/rComponents/RAlert.vue";
import ROverlay from "@/components/shared_components/rComponents/ROverlay.vue";
import { useStorage } from '@vueuse/core'
import { onBeforeMount } from 'vue';
import { useDarkModeStore } from '@/stores/darkMode.store';
const darkModeStore = useDarkModeStore();

onBeforeMount(() => {
  darkModeStore.setModeTheme(useStorage('theme-dark', false).value || (!('theme-dark' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
})

</script>
<template>
  <ResolveLayout class="font-body">
    <router-view></router-view>
  </ResolveLayout>
  <r-alert></r-alert>
  <r-overlay></r-overlay>
</template>
