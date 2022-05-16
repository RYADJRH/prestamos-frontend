<script setup lang="ts">
import CardAmount from '@/components/home/CardAmount.vue';
import { useHomeStore } from '@/stores/home.store';
import { useAuthStore } from '@/stores/auth.store';
import { computed, onBeforeMount } from 'vue';

const authStore = useAuthStore();
const homeStore = useHomeStore();
const amounts = computed(() => homeStore.getTotalAmounts);

onBeforeMount(() => [
  homeStore.getApiTotalAmounts(authStore.profileBeneficiary?.id_beneficiary as number)
    .catch(() => { })
])

</script>
<template>
  <div class="w-full">
    <h1 class="text-2xl text-gray-600 mb-2">Invertido:</h1>
    <div class="flex flex-wrap -mx-2">
      <div class="w-full md:w-1/3 px-2 mb-2 md:mb-0">
        <card-amount :amount="amounts.amount_borrow" label="prestado"></card-amount>
      </div>
      <div class="w-full md:w-1/3 px-2 mb-2 md:mb-0">
        <card-amount :amount="amounts.amount_interest" label="intereses"></card-amount>
      </div>
      <div class="w-full md:w-1/3 px-2 mb-2 md:mb-0">
        <card-amount :amount="amounts.amount_borrow_interest" label="total prestado"></card-amount>
      </div>
    </div>
  </div>
  <div class="w-full mt-8">
    <h1 class="text-2xl text-gray-600 mb-2">Recuperado:</h1>

    <div class="flex flex-wrap -mx-2">
      <div class="w-full md:w-1/3 px-2 mb-2 md:mb-0">
        <card-amount :amount="amounts.amount_charged" label="cobrado"></card-amount>
      </div>
      <div class="w-full md:w-1/3 px-2 mb-2 md:mb-0">
        <card-amount :amount="amounts.amount_in_proccess" label="en proceso"></card-amount>
      </div>
      <div class="w-full md:w-1/3 px-2 mb-2 md:mb-0">
        <card-amount :amount="amounts.amount_un_paid" label="no pagado"></card-amount>
      </div>
    </div>
  </div>
</template>
