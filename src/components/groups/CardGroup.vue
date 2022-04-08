<script setup lang="ts">
import { Group } from "@/interfaces/group.interface";
import { TrashIcon, PencilAltIcon } from "@heroicons/vue/solid";
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
  <div class="bg-white p-3 shadow-sm rounded-md">
    <a
      class="font-bold text-lg text-gray-600 truncate hover:underline decoration-solid underline-offset-4 cursor-pointer"
      @click="emits('selected:group', group.slug as string)"
    >
      {{ group.name_group }}
    </a>
    <div class="flex flex-col gap-1 mt-2">
      <span class="text-gray-500 text-sm">
        Fecha de inicio: {{ formatDate(group.created_group, "LL") }}
      </span>
      <span class="text-gray-500 text-sm">
        Dia de pago : {{ group.day_payment_name as string }}
      </span>
    </div>
    <div class="flex justify-end" v-if="!group.state_archived_group">
      <r-btn
        variant="danger"
        class="px-1 py-2 mr-3"
        @click="emits('delete:group', group.id_group as number)"
      >
        <TrashIcon class="h-5 w-5"></TrashIcon>
      </r-btn>
      <r-btn
        variant="success"
        class="px-1 py-2"
        @click="emits('update:group', group)"
      >
        <PencilAltIcon class="h-5 w-5"></PencilAltIcon>
      </r-btn>
    </div>
  </div>
</template>
