<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "danger";
const props = defineProps<{
  modelValue: number | string;
  id: string;
  value:number | string
  variant: Variant;
  name: string;
  label?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: number | string): void;
}>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value: number | string) {
    emits("update:modelValue", value);
  },
});
</script>
<template>
  <label class="inline-flex items-center" :for="id">
    <input
      v-model="model"
      :id="id"
      :value="value"
      type="radio"
      :name="name"
      class="rounded-full  focus:ring-1 focus:ring-offset-2 disabled:cursor-not-allowed"
      :class="{
        'text-sky-800 focus:ring-sky-800': variant == 'primary',
        'text-red-800 focus:ring-red-800': variant == 'danger',

      }"
    />
    <span class="ml-2 text-gray-500">{{ label }}</span>
  </label>
</template>
