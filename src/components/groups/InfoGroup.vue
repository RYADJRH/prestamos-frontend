<script setup lang="ts">
import { computed } from "vue";

import {
  CalendarIcon,
  ArchiveIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/solid";
import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import { Group } from "@/interfaces/group.interface";

const individualGroupStore = useIndividualGroupStore();
const group = computed(() => {
  return individualGroupStore.getGroup as Group;
});

const amounts = computed(() => {
  return individualGroupStore.getAmountsGroup;
});
</script>

<template>
  <div class="flex flex-wrap bg-white rounded-md p-4 shadow-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CalendarIcon class="h-6 w-6"></CalendarIcon>
      Fecha : <strong>{{ formatDate(group.created_group, "LL") }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CalendarIcon class="h-6 w-6"></CalendarIcon>
      Dia de pago :<strong>{{ group.day_payment_name }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <ArchiveIcon class="h-6 w-6"></ArchiveIcon>
      Status :
      <strong> {{ group.state_archived_group ? "Archivado" : "En proceso" }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <UserGroupIcon class="h-6 w-6"></UserGroupIcon>
      No.miembros :<strong>{{ amounts.number_members }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
      Prestado :<strong>{{ moneyMxn(amounts.amount_borrow) }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
      Intereses :<strong>{{ moneyMxn(amounts.amount_interest) }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
      Cobrado :<strong>{{ moneyMxn(amounts.amount_charged) }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
      Total :<strong>{{ moneyMxn(amounts.amount_total) }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
      Restante :<strong>{{ moneyMxn(amounts.amount_diff_total_charged) }}</strong>
    </div>
  </div>
</template>
