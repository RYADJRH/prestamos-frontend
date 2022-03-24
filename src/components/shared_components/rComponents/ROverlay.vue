<script setup lang="ts">
import {inject } from "vue";
import RSpinner from "./RSpinner.vue";
const loading = inject('loading-full') as boolean;

</script>
<template>
  <div
    class="bg-black inset-0 fixed bg-opacity-50 z-[100] grid place-content-center"
    v-if="loading"
  >
    <r-spinner variant="light" loading-full></r-spinner>
  </div>
</template>
