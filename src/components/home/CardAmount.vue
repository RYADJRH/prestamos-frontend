<script setup lang="ts">
import { moneyMxn } from '@/utils/currency';
const props = withDefaults(defineProps<{
    amount: number,
    label: string
}>(), { amount: 0 });

</script>
<template>
    <div
        class="h-32 bg-white shadow-sm rounded-md px-4 py-5 flex flex-col justify-between  border-l-8 border-sky-800 dark:bg-gray-700 dark:border-gray-800">
        <h1 class="font-bold text-right text-3xl text-gray-600 dark:text-gray-400">{{ moneyMxn(props.amount) }}</h1>
        <h5 class="text-left text-xl text-sky-800 font-bold first-letter:uppercase dark:text-white">{{ props.label }}
        </h5>
    </div>
</template>