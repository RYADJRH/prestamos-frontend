<script setup lang="ts">

withDefaults(
  defineProps<{ modelValue: string; type: string; stateError?: boolean }>(),
  { stateError: false }
);

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emits("update:modelValue", target.value);
}
</script>

<template>
  <input
    v-model="modelValue"
    @input="updateInput"
    :type="type"
    class="block w-full rounded-md border border-gray-600 shadow-sm focus:border-sky-800 focus:ring-1 focus:ring-sky-800 disabled:cursor-not-allowed disabled:bg-gray-100"
    :class="{ 'border-red-800': stateError }"
  />
</template>
