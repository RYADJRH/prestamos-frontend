<script setup lang="ts">
import { Beneficiary } from "@/interfaces/beneficiary.interface";
import { PencilAltIcon } from "@heroicons/vue/solid";
withDefaults(
  defineProps<{
    add?: boolean;
    modeEdit?: boolean;
    beneficiary: Beneficiary;
  }>(),
  {
    add: false,
    modeEdit: false,
  }
);
</script>

<template>
  <div class="h-56 flex justify-center">
    <div
      class="h-32 w-32 relative rounded-md bg-white border hover:border-2 hover:bg-gray-100 hover:border-sky-800 flex justify-center items-center cursor-pointer"
    >
      <div
        class="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-md grid place-content-center"
        v-if="modeEdit"
      >
        <PencilAltIcon class="text-white h-10 w-10"></PencilAltIcon>
      </div>
      <slot name="acronym">
        <h1 class="text-6xl text-sky-800">{{ beneficiary.name_acronym }}</h1>
      </slot>
      <slot name="name-beneficiary">
        <p class="absolute top-full text-center text-white mt-2">
          {{ beneficiary.name_beneficiary }}
        </p>
      </slot>
    </div>
  </div>
</template>
