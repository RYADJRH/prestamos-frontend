<script setup lang="ts">

defineProps<{ modelValue: number | string, items: Record<'text' | 'value', string | number>[] }>();

const emits = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>();

function changeModelValue(e: Event) {
    const target = e.target as HTMLFormElement;
    emits('update:modelValue', target.value);
}

</script>
<template>
    <select v-model="modelValue" @change="changeModelValue"
        class="block w-full rounded-md border border-gray-600 shadow-sm focus:border-sky-800 focus:ring-1 focus:ring-sky-800 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-600 dark:disabled:bg-gray-500 dark:text-gray-100 dark:focus:border-gray-300 dark:focus:ring-gray-300">
        <option :value="item.value" v-for="item in items">{{ item.text }}</option>
    </select>
</template>