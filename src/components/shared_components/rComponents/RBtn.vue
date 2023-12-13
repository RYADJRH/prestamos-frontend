<script setup lang="ts">
type variant = "success" | "outline-light" | "primary" | "danger";
withDefaults(defineProps<{ variant?: variant }>(), { variant: "primary" });
</script>

<template>
  <button
    class="inline-flex items-center justify-center p-2 rounded-md uppercase text-xs font-bold disabled:cursor-not-allowed focus:outline-none focus:ring-2 disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:border dark:disabled:border-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    :class="{
      'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-700 focus:ring-sky-200 dark:bg-sky-800 dark:hover:bg-sky-900 dark:focus:ring-sky-300':
        variant == 'primary',
      'bg-red-500 text-white hover:bg-red-600 active:bg-red-500 focus:ring-red-200 dark:bg-red-800 dark:hover:bg-red-900 dark:focus:ring-red-300':
        variant == 'danger',
      'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-500 focus:ring-emerald-200 dark:bg-emerald-800 dark:hover:bg-emerald-900 dark:focus:ring-emerald-300':
        variant == 'success',
      'border border-white text-white hover:bg-white hover:bg-opacity-10 focus:ring-white':
        variant == 'outline-light',
    }">
    <slot></slot>
  </button>
</template>
