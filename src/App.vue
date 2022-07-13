<script setup lang="ts">
import RAlert from "@/components/shared_components/rComponents/RAlert.vue";
import ROverlay from "@/components/shared_components/rComponents/ROverlay.vue";
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  document.querySelector('html')!.classList.add('dark')

})

</script>
<template>
  <ResolveLayout class="font-body">
    <router-view></router-view>
  </ResolveLayout>
  <r-alert></r-alert>
  <r-overlay></r-overlay>
</template>
