<script setup lang="ts">
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ClipboardListIcon,
} from "@heroicons/vue/solid";
import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { usePayslipGroupStore } from "@/stores/payslipGroup.store";
import { computed } from "vue";

const payslipGroupStore = usePayslipGroupStore();
const payslip = computed(() => payslipGroupStore.getPayslip);
</script>

<template>
  <div class="flex flex-wrap bg-white rounded-md p-4 shadow-sm text-gray-600">
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CalendarIcon class="h-6 w-6"></CalendarIcon>
      Fecha : <strong>{{ formatDate(payslip.created_payslip, "LL") }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <ClipboardListIcon class="h-6 w-6"></ClipboardListIcon>
      No.pagos :<strong>{{ payslip.number_payments }}</strong>
    </div>
    <div class="w-full lg:w-1/3 flex gap-4 my-2">
      <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
      Pagado :<strong>{{ moneyMxn(payslip.amount_payments) }}</strong>
    </div>
  </div>
</template>
