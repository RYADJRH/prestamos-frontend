<script setup lang="ts">
import { AdjustPayment } from '@/interfaces/payments.interface';
import { moneyMxn } from "@/utils/currency";
import { formatDate } from "@/utils/dates";

defineProps<{ adjust: AdjustPayment[] }>()

</script>
<template>
    <table class="w-full text-sm text-gray-600 dark:text-gray-300">
        <thead>
            <th>Fecha</th>
            <th>Monto anterior</th>
            <th>Monto actual</th>
        </thead>
        <tbody>
            <tr v-for="item in adjust.sort((a, b) => a.id - b.id)" :key="item.id">
                <td class="py-1">{{ formatDate(item.date_adjust_payment, 'llll') }}</td>
                <td class="py-1">{{ moneyMxn(item.before_amount_decimal) }}</td>
                <td class="py-1">{{ moneyMxn(item.after_amount_decimal) }}</td>
            </tr>
        </tbody>
    </table>
</template>