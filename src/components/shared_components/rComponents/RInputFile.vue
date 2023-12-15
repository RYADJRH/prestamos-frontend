
<script setup lang="ts">
const props = withDefaults(
    defineProps<{ modelValue: File | null; stateError?: boolean, accept?: string }>(),
    { stateError: false, accept: '' }
);
const emits = defineEmits<{
    (e: "update:modelValue", value: File | null): void;
}>();

function selectedFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || !files[0]) {
        emits("update:modelValue", null);
    } else {
        emits("update:modelValue", files[0]);
    }
}

/* function reset() {
    const file_aux = file.value as HTMLInputElement;
    file_aux.value = '';
    emits("update:modelValue", null);
} */

</script>

<template>
    <input @change="selectedFile"
        class="block w-full border border-gray-600 rounded-md file:border-none file:py-1.5 file:bg-sky-800/10 focus:outline-sky-800 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100 dark:focus:outline-none dark:file:bg-gray-400 dark:file:text-gray-800 dark:bg-gray-600 dark:disabled:bg-gray-500 dark:text-gray-100 dark:focus:border-gray-300 dark:focus:ring-gray-300"
        :class="{ 'border-red-800': stateError }" type="file" :accept="accept" />
</template>