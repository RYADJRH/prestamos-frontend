<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
    <label class="block">
        <span class="text-gray-500">{{ title }}</span>
        <slot></slot>
    </label>
</template>