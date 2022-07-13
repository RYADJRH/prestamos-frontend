<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
    <div class="block">
        <span class="text-gray-500 dark:text-white">{{ title }}</span>
        <slot></slot>
    </div>
</template>