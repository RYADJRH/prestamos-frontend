<script setup lang="ts">
import { Errors } from "@/interfaces/errors.interface";
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
  show?: boolean;
  errors: Errors;
  field: string;
}>(), {
  show: true
});

const message = computed(() => {
  return props.errors?.[props.field]?.[0];
});


</script>

<template>
  <p v-if="show" class="w-full text-red-800 text-sm dark:text-red-400">{{ message }}</p>
</template>
