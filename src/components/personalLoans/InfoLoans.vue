<script setup lang="ts">
import { computed } from 'vue';
import { moneyMxn } from "@/utils/currency";
import { CalculatorIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid';
import { useInvidualLoansStore } from '@/stores/individualLoans.store';

const individualLoansStore = useInvidualLoansStore();
const amounts = computed(() => individualLoansStore.getAmountsLoans);

</script>

<template>
    <div class="flex flex-wrap bg-white rounded-md p-4 shadow-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CalculatorIcon class="h-6 w-6"></CalculatorIcon>
            No.prestamos:<strong>{{ amounts.number_loans }}</strong>
        </div>
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
            Prestado :<strong>{{ moneyMxn(amounts.amount_borrow) }}</strong>
        </div>
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
            intereses :<strong>{{ moneyMxn(amounts.amount_interest) }}</strong>
        </div>
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
            Total :<strong>{{ moneyMxn(amounts.amount_pay) }}</strong>
        </div>
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
            Cobrado :<strong>{{ moneyMxn(amounts.amount_charged) }}</strong>
        </div>
        <div class="w-full lg:w-1/3 flex gap-4 my-2">
            <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
            Restante :<strong>{{ moneyMxn(amounts.amount_diff_total_charged) }}</strong>
        </div>
    </div>
</template>e