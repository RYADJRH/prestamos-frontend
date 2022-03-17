<template>
    <p class="w-full text-red-800 text-sm">{{ message }}</p>
</template>

<script setup lang="ts">
import { Errors } from '@/interfaces/errors.interface';
import { computed } from 'vue';

const props = defineProps<{
    errors: Errors,
    field: string
}>();


const message = computed(() => {
    return props.errors?.[props.field]?.[0];
});

</script>