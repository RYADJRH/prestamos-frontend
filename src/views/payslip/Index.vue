<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowSmLeftIcon } from "@heroicons/vue/solid";
import { usePayslipGroupStore } from "@/stores/payslipGroup.store";

import InfoPayslip from "@/components/payslips/InfoPayslip.vue";
import ViewPayments from "@/components/payslips/ViewPayments.vue";

const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const router = useRouter();
const route = useRoute();
const payslipGroupStore = usePayslipGroupStore();

const payslip = computed(() => payslipGroupStore.getPayslip);

async function fnPayslip() {
  await payslipGroupStore.getApiPayslip(slug_payslip.value);
}

async function fnGetPayments() {
  await payslipGroupStore.getPaymentsPayslip(slug_payslip.value, 1, "").catch(() => {});
}

const slug_payslip = ref("");
onBeforeMount(async () => {
  slug_payslip.value = route.params.slug as string;
  setLoadingFull(true);
  await fnPayslip();
  await fnGetPayments();
  setLoadingFull(false);
});

onBeforeUnmount(() => {
  payslipGroupStore.$reset();
  setLoadingFull(false);
});
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <a
          class="text-gray-600 hover:text-red-800 cursor-pointer"
          @click="router.push(`/grupo/${payslip.slug_group}`)"
        >
          <ArrowSmLeftIcon class="w-8 h-8"></ArrowSmLeftIcon>
        </a>
        <h1 class="text-2xl text-gray-600">{{ payslip.name_payslip }}</h1>
      </div>
    </div>
    <info-payslip class="mt-4"></info-payslip>
    <view-payments class="mt-8"></view-payments>
  </div>
</template>
