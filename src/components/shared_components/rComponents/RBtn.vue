<script setup lang="ts">
type variant = "success" | "outline-light" | "primary" | "danger";

withDefaults(defineProps<{ variant?: variant }>(), { variant: "primary" });

const PRIMARY_CLASSES = `enabled:text-white
                          enabled:bg-gradient-to-r
                          enabled:from-sky-600
                          enabled:via-sky-700
                          enabled:to-sky-800
                          enabled:hover:bg-gradient-to-br
                          enabled:focus:ring-sky-400`;

const DANGER_CLASSES = `enabled:text-white
                          enabled:bg-gradient-to-r
                          enabled:from-red-500
                          enabled:via-red-600
                          enabled:to-red-700
                          enabled:hover:bg-gradient-to-br
                          enabled:focus:ring-red-300`;

const SUCCESS_CLASSES = `enabled:text-white
                          enabled:bg-gradient-to-r
                          enabled:from-emerald-500
                          enabled:via-emerald-600
                          enabled:to-emerald-700
                          enabled:hover:bg-gradient-to-br
                          enabled:focus:ring-emerald-300`;

const OUTLINE_LIGHT_CLASSES = 'border border-white text-white hover:bg-white hover:bg-opacity-10 focus:ring-white';


</script>
<template>
  <button class="px-4
          h-9
          max-h-9
          inline-block
          font-medium
          rounded-md
          uppercase
          text-xs
          transform
          active:scale-95
          transition-transform
          disabled:cursor-not-allowed
          focus:outline-none
          focus:ring-2
          disabled:border
          disabled:active:scale-100
        disabled:border-gray-300
        disabled:bg-gray-100
        disabled:text-gray-500
          dark:disabled:border
        dark:disabled:border-gray-400
        dark:disabled:bg-gray-700
        dark:disabled:text-gray-400" :class="{
          [PRIMARY_CLASSES]: variant === 'primary',
          [DANGER_CLASSES]: variant === 'danger',
          [SUCCESS_CLASSES]: variant === 'success',
          [OUTLINE_LIGHT_CLASSES]: variant === 'outline-light',
        }">
    <slot></slot>
  </button>
</template>
