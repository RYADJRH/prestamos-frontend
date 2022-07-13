<script setup lang="ts">
type variant = "primary" | "light" | "danger";
type Size = "normal" | "btn";

withDefaults(defineProps<{ variant?: variant; loadingFull?: boolean; size?: Size }>(), {
  variant: "primary",
  loadingFull: false,
  size: "normal",
});
</script>

<template>
  <svg class="animate-spin" :class="{
    'text-red-800 dark:text-white': variant == 'danger',
    'text-sky-800 dark:text-white': variant == 'primary',
    'text-white dark:text-white': variant == 'light',
    'h-20 w-20': loadingFull,
    'h-6 w-6': !loadingFull && size == 'normal',
    'h-4 w-4': !loadingFull && size == 'btn',
  }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
</template>
