<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
    <div class="block">
        <span class="text-gray-500">{{ title }}</span>
        <slot></slot>
    </div>
</template>