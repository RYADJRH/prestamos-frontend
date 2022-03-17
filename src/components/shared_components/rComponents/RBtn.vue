
<script setup lang="ts">
withDefaults(defineProps<{ variant?: string }>(), { variant: 'primary' });
</script>

<template>
    <button
        type="submit"
        class="inline-flex items-center justify-center p-2.5 rounded-md uppercase text-sm font-bold disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-inset"
        :class="{
            'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-700 disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500': variant == 'primary'
        }"
    >
        <slot></slot>
    </button>
</template>