<script setup lang="ts">
import { computed } from 'vue';
import {
    ChevronRightIcon,
    ChevronLeftIcon,
} from "@heroicons/vue/24/solid";

type Variant = 'dark';

const props = withDefaults(
    defineProps<{
        modelValue: number,
        totalPages: number;
        btnPageVisibles?: number;
        variant: Variant
    }>(),
    {
        btnPageVisibles: 3,
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();

const isBack = computed(() => props.modelValue > 1);
const isNext = computed(() => props.modelValue < props.totalPages && props.totalPages > props.btnPageVisibles);

const startPage = computed(() => {
    if (props.modelValue == 1) return 1;

    if (props.modelValue == props.totalPages) {
        return props.modelValue - props.btnPageVisibles + (props.totalPages < props.btnPageVisibles ? 2 : 1)
    }
    return props.modelValue - 1;
})

const endPage = computed(() => {
    return Math.min(startPage.value + props.btnPageVisibles - 1, props.totalPages)
})

const pages = computed(() => {
    let pages: number[] = [];
    for (let index = startPage.value; index <= endPage.value; index++) {
        pages.push(index);
    }
    return pages;
})

function selectedPage(page: number) {
    emits('update:modelValue', page);
}


const SELECTED_CLASSES = {
    dark: 'bg-black text-white'
}
</script>

<template>
    <div class="inline-flex gap-2">
        <button @click="emits('update:modelValue', modelValue - 1)" :disabled="!isBack"
            class="min-w-[1.5rem] max-w-[3rem] flex items-center justify-center rounded-md bg-white border shadow-md cursor-pointer disabled:cursor-not-allowed disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 dark:text-gray-700"
            :class="{ 'hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-gray-200': variant == 'dark' }">
            <ChevronLeftIcon></ChevronLeftIcon>
        </button>

        <button v-for="page in pages" @click="selectedPage(page)"
            class="min-w-[1.5rem] max-w-[3rem] flex items-center justify-center rounded-md border shadow-md cursor-pointer disabled:cursor-not-allowed disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500  dark:text-gray-200"
            :class="{
                'hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-gray-200': variant === 'dark',
                [SELECTED_CLASSES[variant]]: modelValue === page,
            }">{{ page }}</button>

        <button @click="emits('update:modelValue', modelValue + 1)" :disabled="!isNext"
            class="min-w-[1.5rem] max-w-[3rem] flex items-center justify-center rounded-md bg-white border shadow-md cursor-pointer disabled:cursor-not-allowed disabled:border disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 dark:text-gray-700"
            :class="{ 'hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-gray-200': variant == 'dark' }">
            <ChevronRightIcon></ChevronRightIcon>
        </button>
    </div>
</template>


