<script setup lang="ts">
import RAlert from "@/components/shared_components/rComponents/RAlert.vue";
import ROverlay from "@/components/shared_components/rComponents/ROverlay.vue";
</script>
<template>
  <ResolveLayout>
    <router-view></router-view>
  </ResolveLayout>
  <r-alert></r-alert>
  <r-overlay></r-overlay>
</template>
