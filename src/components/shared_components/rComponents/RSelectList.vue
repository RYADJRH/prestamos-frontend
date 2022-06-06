<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { onClickOutside } from "@vueuse/core";
import { SearchIcon } from "@heroicons/vue/solid";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RInput from "./RInput.vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    data: any[];
    itemLayout: any;
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "click:item", item: any): void;
  (e: "close"): void;
}>();

const showOptions = ref(false);
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emits("update:modelValue", target.value);
  showOptions.value = true;
}

const target = ref();
onClickOutside(target, (event) => {
  emits("close");
  showOptions.value = false;
});


function clickItem(item: any) {
  if (!item.agregado) {
    emits("click:item", item);
  }
}
</script>
<template>
  <div
    class="relative z-[60]"
    :ref="
      (el) => {
        target = el;
      }
    "
  >
    <div class="block relative w-full" @click="showOptions = true">
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
      </span>
      <r-input
        v-model="modelValue"
        @input="handleInput"
        type="search"
        placeholder="busqueda"
        class="pl-10"
        v-focus
      ></r-input>
    </div>
    <div
      class="bg-white p-4 h-auto shadow-lg rounded-md absolute w-full mt-1"
      v-show="modelValue && showOptions"
      tabindex="0"
    >
      <div v-for="item in props.data" @click="clickItem(item)" v-if="!props.loading">
        <component :is="props.itemLayout" :item="item"></component>
      </div>

      <div
        v-if="data.length == 0 && !props.loading"
        class="h-12 text-sky-800 flex items-center justify-center px-2 gap-2"
      >
        <slot name="no-data"> Sin datos </slot>
      </div>

      <div class="h-12 flex items-center justify-center px-2 gap-2" v-if="props.loading">
        <r-spinner></r-spinner>
      </div>
    </div>
  </div>
</template>
