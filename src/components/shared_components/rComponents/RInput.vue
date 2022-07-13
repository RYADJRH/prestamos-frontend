<script setup lang="ts">
import { current } from "tailwindcss/colors";
import { computed, ref } from "vue";
const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    type: string;
    stateError?: boolean;
    currency?: boolean;
    prependCurrency?: string,
    minCurrency?: number
  }>(),
  { stateError: false, currency: false, prependCurrency: "$", minCurrency: 0 }
);

const isFocusInput = ref(false);
type ValueType = String | number;
const emits = defineEmits<{
  (e: "update:modelValue", value: ValueType): void;
}>();

const value = computed({
  get() {
    if (!props.currency) {
      return props.modelValue;
    } else {
      if (isFocusInput.value) {
        return props.modelValue;
      } else {
        const numero = props.modelValue as number;
        return props.prependCurrency + " " + numero.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
      }
    }
  },
  set(value: number | string) {
    if (!props.currency) {
      emits("update:modelValue", value);
    } else {
      const numero = value.toString();
      let newValue = parseFloat(numero.replace(/[^\d\.]/g, ""));


      if (isNaN(newValue) || (newValue < props.minCurrency)) {
        newValue = props.minCurrency;
      }
      newValue = parseFloat(newValue.toFixed(2));
      emits("update:modelValue", newValue);
    }
  },
});

function isNumberKey(event: KeyboardEvent) {
  if (props.currency || props.type == "number") {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode <= 13 || (charCode >= 48 && charCode <= 57) || charCode == 46) {
      return true;
    } else {
      event.preventDefault();
    }
  }
}
</script>

<template>
  <input v-model="value" :type="type" @blur="isFocusInput = false" @focus="isFocusInput = true"
    @keypress="isNumberKey($event)"
    class="block w-full rounded-md shadow-sm border border-solid border-gray-600 focus:border-sky-800 focus:ring-offset-0  focus:ring-sky-800 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-600 dark:disabled:bg-gray-500 dark:text-gray-100 dark:focus:border-gray-300 dark:focus:ring-gray-300"
    :class="{ 'border-red-800 dark:border-red-400': stateError }" />
</template>
