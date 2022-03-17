<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
    <label class="block mb-6">
        <span class="text-gray-500">{{ title }}</span>
        <slot></slot>
    </label>
</template>