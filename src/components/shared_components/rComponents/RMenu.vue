<script setup lang="ts">
type Aling = "bottom-right" | "top-right" | "bottom-left" | "top-left";
defineProps<{ modelValue: boolean; align: Aling }>();

</script>

<template>
  <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
    <div v-if="modelValue" :class="{
      'right-0 top-full': align == 'bottom-right',
      'right-0 bottom-full': align == 'top-right',
      'left-0 top-full': align == 'bottom-left',
      'left-0 bottom-full': align == 'top-left',
    }" class="absolute h-auto w-60 border shadow-lg bg-white rounded-md p-3 dark:bg-gray-700 dark:border">
      <ul class="flex flex-col gap-2">
        <slot name="list"></slot>
      </ul>
    </div>
  </transition>
</template>
