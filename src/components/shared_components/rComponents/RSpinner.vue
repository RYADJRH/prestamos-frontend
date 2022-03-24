<script setup lang="ts">
type variant = "primary" | "light";

withDefaults(defineProps<{ variant?: variant; loadingFull?: boolean }>(), {
  variant: "primary",
  loadingFull: false,
});
</script>

<template>
  <svg
    class="animate-spin h-6 w-6"
    :class="{
      'text-sky-800': variant == 'primary',
      'text-white': variant == 'light',
      'h-28 w-28': loadingFull,
    }"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>
