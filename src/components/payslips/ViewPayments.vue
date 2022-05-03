<script setup lang="ts">
import { ref, computed } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { PencilAltIcon, SearchIcon, TrashIcon } from "@heroicons/vue/solid";
import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { Payment, getValuePayment } from "@/interfaces/utils/Payment.interface";
import { usePayslipGroupStore } from "@/stores/payslipGroup.store";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import AddPayments from "@/components/payslips/AddPayments.vue";

const payslipGroupStore = usePayslipGroupStore();
const payslip = computed(() => payslipGroupStore.getPayslip);

const fieldsPayments = [
  { key: "full_name", name: "Nombre" },
  { key: "amount_payment_decimal", name: "Total abonado" },
  { key: "created_payment", name: "Fecha abono" },
  { key: "state_payment", name: "Status" },
  { key: "acciones", name: "Accciones" },
];
const payments = computed(() => payslipGroupStore.getPayments);

const inputSearchPayments = ref("");
const inputSearchDebounce = useDebounceFn(
  async () => {
    await fnGetPayments();
  },
  500,
  { maxWait: 1000 }
);

const currentPage = computed({
  get() {
    return payslipGroupStore.getCurrentPagePayments;
  },
  async set(page: number) {
    payslipGroupStore.setPagePayments(page);
    await fnGetPayments();
  },
});

const totalPages = computed({
  get() {
    return payslipGroupStore.getTotalPagesPayments;
  },
  set(pages: number) {
    payslipGroupStore.setTotalPagePayments(pages);
  },
});

async function fnPayslip() {
  await payslipGroupStore.getApiPayslip(payslip.value.slug);
}

async function fnGetPayments() {
  await payslipGroupStore
    .getPaymentsPayslip(payslip.value.slug, currentPage.value, inputSearchPayments.value)
    .catch(() => { });
}

async function loadingPaymentsPayslip() {
  modalAddPayment.value = false;
  await fnPayslip();
  await fnGetPayments();
}

const modalAddPayment = ref(false);
const loadingAddPayment = ref(false);

function updateLoadingModal(value: boolean) {
  loadingAddPayment.value = value;
}
</script>
<template>
  <div>
    <h1 class="text-gray-600 text-lg">Pagos</h1>
    <div class="mt-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div>
          <!-- @click="addMemberOpenModal" -->
          <r-btn @click="modalAddPayment = true"> Agregar pago </r-btn>
        </div>
        <div class="block relative md:w-64 w-full mt-2 md:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
          </span>
          <r-input @input="inputSearchDebounce" v-model="inputSearchPayments" class="pl-10" type="search"
            placeholder="busqueda"></r-input>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <r-table :fields="fieldsPayments" :items="payments" :hidden-footer="payments.length == 0">
        <template #cell(full_name)="{ data }">
          <span class="font-bold">{{ data.full_name }}</span>
        </template>
        <template #cell(amount_payment_decimal)="{ data }">
          {{ moneyMxn(data.amount_payment_decimal) }}
        </template>
        <template #cell(created_payment)="{ data }">
          {{ formatDate(data.created_payment, "LL") }}
        </template>

        <template #cell(state_payment)="{ data }">
          <div
            class="px-3 py-1 rounded-md font-bold text-center hover:underline hover:underline-offset-4 hover:cursor-pointer"
            :class="{
              'bg-emerald-100 text-emerald-800': data.state_payment == Payment.paid,
              'bg-red-100 text-red-800': data.state_payment == Payment.unpaid,
              'bg-yellow-100 text-yellow-800': data.state_payment == Payment.inprocess,
            }">
            {{ getValuePayment(data.state_payment) }}
          </div>
        </template>

        <template #cell(acciones)="{ data }">
          <r-btn variant="danger" class="mr-3 px-1 py-2">
            <!-- @click="deleteMember(data.id_group_borrower)" -->
            <TrashIcon class="h-5 w-5 text-white"></TrashIcon>
          </r-btn>

          <r-btn variant="success" class="mr-3 px-1 py-2">
            <!-- @click="editMemberOpenModal(data)" -->
            <PencilAltIcon class="h-5 w-5 text-white"></PencilAltIcon>
          </r-btn>
        </template>
        <template #footer>
          <div class="flex justify-end items-center h-full">
            <div>
              <r-pagination v-model="currentPage" :total-pages="totalPages" variant="dark"></r-pagination>
            </div>
          </div>
        </template>
      </r-table>
    </div>
    <r-modal v-model="modalAddPayment" :loading="loadingAddPayment" title="Agregar pagos" size="lg" hidden-footer>
      <template #content>
        <add-payments @update:loading="updateLoadingModal" @update:payments-payslip="loadingPaymentsPayslip">
        </add-payments>
      </template>
    </r-modal>
  </div>
</template>
