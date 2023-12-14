<script setup lang="ts">
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import { BorrowerGroupResponse } from "@/interfaces/borrower.interface";

defineProps<{
  item: BorrowerGroupResponse;
}>();
</script>

<template>
  <div class="min-h-[3rem] mb-2 flex items-center px-2" :class="{
    'text-gray-600   hover:bg-sky-800/5 cursor-pointer dark:text-white dark:hover:bg-gray-200/5': !item.agregado,
    'cursor-not-allowed bg-gray-100 border bg-opacity-50 border-gray-300 text-gray-500 dark:text-white dark:bg-gray-800':
      item.agregado,
  }">
    <div class="flex items-center gap-2 w-80">
      <UserCircleIcon class="h-6 w-6"></UserCircleIcon>
      {{ item.full_name }}
    </div>
    <div class="w-20 text-sm" v-if="item.agregado">Agregado</div>
  </div>
</template>
