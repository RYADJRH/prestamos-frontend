<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<
    { modelValue: string, type: string, stateError?: boolean }
>(), { stateError: false });

const inputValue = ref(props.modelValue);

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

function updateInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emits('update:modelValue', target.value);
}

</script>

<template>
    <input
        v-model="inputValue"
        @input="updateInput"
        :type="type"
        class="block w-full rounded-md border-transparent shadow-sm bg-gray-100 focus:border-sky-800 focus:bg-white focus:ring-0 disabled:cursor-not-allowed"
        :class="{ 'border-red-800': stateError }"
    />
</template>