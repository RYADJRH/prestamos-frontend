<script setup lang="ts">
import { Group } from "@/interfaces/group.interface";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import { formatDate } from "@/utils/dates";

defineProps<{ group: Group }>();

const emits = defineEmits<{
  (e: "delete:group", id: number): void;
  (e: "update:group", group: Group): void;
  (e: "selected:group", slug: string): void;
}>();
</script>

<template>
  <div class="bg-white p-3 shadow-sm rounded-md dark:bg-gray-700">
    <a class="font-bold text-lg text-gray-600 truncate hover:underline decoration-solid underline-offset-4 cursor-pointer dark:text-white"
      @click="emits('selected:group', group.slug as string)">
      {{ group.name_group }}
    </a>
    <div class="flex flex-col gap-1 mt-2">
      <span class="text-gray-500 text-sm dark:text-white">
        Fecha de inicio: {{ formatDate(group.created_group, "LL") }}
      </span>
      <span class="text-gray-500 text-sm dark:text-white">
        Dia de pago : {{ group.day_payment_name as string }}
      </span>
    </div>
    <div class="flex justify-end" v-if="!group.state_archived_group">
      <r-btn variant="danger" class="mr-2 w-8 grid place-content-center" @click="emits('delete:group', group.id_group as number)">
        <TrashIcon class="h-4 w-4"></TrashIcon>
      </r-btn>
      <r-btn variant="success" class="w-8 grid place-content-center" @click="emits('update:group', group)">
        <PencilSquareIcon class="h-4 w-4"></PencilSquareIcon>
      </r-btn>
    </div>
  </div>
</template>
