<script setup lang="ts">
type variant = "success" | "outline-light" | "primary" | "danger";
withDefaults(defineProps<{ variant?: variant }>(), { variant: "primary" });
</script>

<template>
  <button
    class="inline-flex items-center justify-center p-2.5 rounded-md uppercase text-sm font-bold disabled:cursor-not-allowed focus:outline-none focus:ring-2 disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
    :class="{
      'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-700': variant == 'primary',
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-600': variant == 'danger',
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-600':
        variant == 'success',
      'border border-white focus:ring-white text-white hover:bg-white hover:bg-opacity-5 ':
        variant == 'outline-light',
    }"
  >
    <slot></slot>
  </button>
</template>
