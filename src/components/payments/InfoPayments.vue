<script setup lang="ts">
import { computed } from 'vue';
import { usePaymentStore } from '@/stores/payments.store';
import { CalculatorIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid';
import { moneyMxn } from "@/utils/currency";

const paymentStore = usePaymentStore();

const totalPayments = computed(() => paymentStore.getTotalPayments);
const totalOwe = computed(() => paymentStore.getTotalOwe);
</script>

<template>
    <div class="flex flex-wrap bg-white rounded-md p-4 shadow-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CalculatorIcon class="h-6 w-6"></CalculatorIcon>
            No.pagos :<strong>{{ totalPayments }}</strong>
        </div>
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
            Total adeudado :<strong>{{ moneyMxn(totalOwe) }}</strong>
        </div>
    </div>
</template>