<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from "@vueuse/core";
import { PencilAltIcon, SearchIcon, TrashIcon, CheckCircleIcon } from "@heroicons/vue/solid";
import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { PaymentsPayslip } from '@/interfaces/payments.interface';
import { Payment, getValuePayment } from "@/interfaces/utils/Payment.interface";
import { usePayslipGroupStore } from "@/stores/payslipGroup.store";
import { useDialogStore } from '@/stores/dialog.store';
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import AddPayments from "@/components/payslips/AddPayments.vue";
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';

const payslipGroupStore = usePayslipGroupStore();
const payslip = computed(() => payslipGroupStore.getPayslip);
const dialogStore = useDialogStore();

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

function deletePayment(id_payment: number) {
  dialogStore
    .show({
      confirm: true,
      variant: "question",
      title: "¿Deseas eliminar este pago?",
      description: "¡Esta acción es irreversible!",
    })
    .then(async (result) => {
      if (result) {
        await payslipGroupStore.deletePayment(id_payment)
          .then((isDeleted) => {
            if (isDeleted) {
              fnPayslip();
              dialogStore.show({
                variant: "success",
                title: "Eliminación exitosa",
                description: "¡El pago ha sido eliminado!",
              });
              if (payments.value.length == 0 && totalPages.value > 1) {
                fnGetPayments();
              }
            } else {
              dialogStore.show({
                variant: "error",
                title: "Ocurrio un error",
                description: "¡No se pudo eliminar el pago!",
              });
            }
          })
          .catch(() => {
            dialogStore.show({
              variant: "error",
              title: "Ha ocurrido un error",
              description: "¡No se pudo completar el registro!",
            });
          })
      }
    })
}


const modalUpdateAmountPayment = ref(false);
const loadingUpdateAmountPayment = ref(false);
const selectedPayment = ref<{ amount_payment: number, id_payment: number }>({ amount_payment: 0, id_payment: -1 });

function editAmountPayment(data: PaymentsPayslip) {
  const { amount_payment_decimal, id_payment } = data;
  selectedPayment.value = { amount_payment: amount_payment_decimal, id_payment };
  modalUpdateAmountPayment.value = true;
}

async function saveUpdateAmount() {
  loadingUpdateAmountPayment.value = true;
  await payslipGroupStore.updateAmountPayment(selectedPayment.value.id_payment, selectedPayment.value.amount_payment)
    .then(() => {
      fnPayslip();
      dialogStore.show({
        variant: "success",
        title: "actualización exitosa",
        description: "¡El monto del pago ha sido actualizado!",
      }).then(() => {
        modalUpdateAmountPayment.value = false;
      })
    })
    .catch(() => {
      dialogStore.show({
        variant: "error",
        title: "Ha ocurrido un error",
        description: "¡No se pudo completar el registro!",
      });
    })
  loadingUpdateAmountPayment.value = false;
}

watch(() => modalUpdateAmountPayment.value, (value) => {
  if (!value) {
    selectedPayment.value = { amount_payment: 0, id_payment: -1 };
  }
})

const modalUpdateStatePayment = ref(false);
const loadingUpdateStatePayment = ref(false);

const selectedIdPayment = ref<number>(-1);
const SelectedState = ref<Payment>(Payment.paid);

function updateStatusPayment(id_payment: number, state_payment: Payment) {
  selectedIdPayment.value = id_payment;
  SelectedState.value = state_payment;
  modalUpdateStatePayment.value = true;
}

async function saveStatePayment() {
  loadingUpdateStatePayment.value = true;
  await payslipGroupStore.updateStatePayment(selectedIdPayment.value, SelectedState.value)
    .then(() => {
      fnPayslip();
      dialogStore.show({
        variant: "success",
        title: "actualización exitosa",
        description: "¡El status del pago ha sido actualizado!",
      }).then(() => {
        modalUpdateStatePayment.value = false;
      })
    })
    .catch(() => {
      dialogStore.show({
        variant: "error",
        title: "Ha ocurrido un error",
        description: "¡No se pudo completar el registro!",
      });
    })
  loadingUpdateStatePayment.value = false;
}

watch(() => modalUpdateStatePayment.value, (value) => {
  if (!value) {
    selectedIdPayment.value = -1;
    SelectedState.value = Payment.paid;
  }
})

</script>
<template>
  <div>
    <h1 class="text-gray-600 text-lg">Pagos</h1>
    <div class="mt-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div>
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
          <div @click="updateStatusPayment(data.id_payment, data.state_payment)"
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
          <r-btn variant="danger" class="mr-3 px-1 py-2" @click="deletePayment(data.id_payment)">
            <TrashIcon class="h-5 w-5 text-white"></TrashIcon>
          </r-btn>

          <r-btn variant="success" class="mr-3 px-1 py-2" @click="editAmountPayment(data)">
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
        <add-payments @update:loading="updateLoadingModal" @update:payments-payslip="loadingPaymentsPayslip"
          :loading-save="loadingAddPayment">
        </add-payments>
      </template>
    </r-modal>

    <r-modal v-model="modalUpdateAmountPayment" :loading="loadingUpdateAmountPayment" title="Editar monto de abono"
      hidden-footer>
      <template #content>
        <form @submit.prevent="saveUpdateAmount">
          <r-form-group title="Monto de abono:">
            <r-input v-model="selectedPayment.amount_payment" type="text" class="text-right" currency></r-input>
          </r-form-group>
          <div class="flex justify-end mt-3">
            <r-btn type="submit" :disabled="loadingUpdateAmountPayment">
              <r-spinner v-if="loadingUpdateAmountPayment" class="mr-3"></r-spinner>
              Guardar
            </r-btn>
          </div>
        </form>
      </template>
    </r-modal>

    <r-modal v-model="modalUpdateStatePayment" :loading="loadingUpdateStatePayment" title="Editar estado" hidden-footer>
      <template #content>
        <div v-for="item in Payment" @click="SelectedState = item"
          class="mb-3 px-3 py-1 rounded-md font-bold text-center hover:cursor-pointer" :class="{
            'bg-emerald-100 text-emerald-800 ': item == Payment.paid,
            'bg-red-100 text-red-800': item == Payment.unpaid,
            'bg-yellow-100 text-yellow-800': item == Payment.inprocess
          }">
          <CheckCircleIcon class="w-6 h-6 absolute" v-if="SelectedState == item"></CheckCircleIcon>
          {{ getValuePayment(item) }}

        </div>

        <div class="mt-3 flex justify-end">
          <r-btn :disabled="loadingUpdateStatePayment" @click="saveStatePayment">
            <r-spinner v-if="loadingUpdateStatePayment" class="mr-3"></r-spinner>
            Guardar
          </r-btn>
        </div>
      </template>
    </r-modal>
  </div>
</template>
