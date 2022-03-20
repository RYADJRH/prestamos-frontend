<script setup lang="ts">
withDefaults(defineProps<{ variant?: string }>(), { variant: "primary" });
</script>

<template>
  <button
    class="inline-flex items-center justify-center p-2.5 rounded-md uppercase text-sm font-bold disabled:cursor-not-allowed focus:outline-none focus:ring-2"
    :class="{
      'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-700 disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500':
        variant == 'primary',
      'border border-white focus:ring-white text-white hover:bg-white hover:bg-opacity-5 disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500':
        variant == 'outline-light',
    }"
  >
    <slot></slot>
  </button>
</template>
