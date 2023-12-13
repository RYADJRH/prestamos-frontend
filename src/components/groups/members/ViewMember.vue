<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useToast } from 'vue-toastification';

import { moneyMxn } from '@/utils/currency';
import { formatDate } from '@/utils/dates';

import { usePaymentStore } from '@/stores/payments.store';
import { useDialogStore } from '@/stores/dialog.store';
import { useIndividualGroupStore } from '@/stores/individualGroup.store';
import { Group } from '@/interfaces/group.interface';
import { getValuePayment, Payment } from '@/interfaces/utils/Payment.interface';

import { SearchIcon, TrashIcon } from '@heroicons/vue/solid';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RModal from '@/components/shared_components/rComponents/RModal.vue';
import RPagination from '@/components/shared_components/rComponents/RPagination.vue';
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import AddMemberGroup from '@/components/groups/members/AddMemberGroup.vue';
import ModalPdf from '@/components/shared_components/pdf/ModalPdf.vue';
import RCheckbox from '@/components/shared_components/rComponents/RCheckbox.vue';
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';

const toast = useToast();
const paymentStore = usePaymentStore();
const dialogStore = useDialogStore();
const individualGroupStore = useIndividualGroupStore();

const group = computed(() => {
  return individualGroupStore.getGroup as Group;
});

const inputSearchMembers = ref('');
const inputSearchDebounce = useDebounceFn(
  async () => {
    await fnBorrowerGroup();
  },
  500,
  { maxWait: 1000 }
);

const currentPage = computed({
  get() {
    return individualGroupStore.getCurrentPageBorrower;
  },
  async set(page: number) {
    individualGroupStore.setPageBorrower(page);
    await fnBorrowerGroup();
  },
});

const totalPages = computed({
  get() {
    return individualGroupStore.getTotalPagesBorrower;
  },
  set(pages: number) {
    individualGroupStore.setTotalPageBorrower(pages);
  },
});

const fieldsMiembros = [
  { key: 'full_name', name: 'Nombre' },
  { key: 'amount_borrow', name: 'Prestado' },
  { key: 'amount_interest', name: 'Intereses' },
  { key: 'amount_pay', name: 'A pagar' },
  { key: 'amount_payment_total', name: 'Pagado' },
  { key: 'amount_diff_total_charged', name: 'Restante' },
  { key: 'number_payments', name: 'Pagos' },
  { key: 'state_borrow', name: 'Status' },
  { key: 'acciones', name: 'Acciones' },
];
const borrowers = computed(() => individualGroupStore.getBorrowersAmount);

async function fnBorrowerGroup() {
  await individualGroupStore
    .getApiBorrowersGroup(group.value.slug as string, currentPage.value, inputSearchMembers.value)
    .catch(() => { });
}

const modalAddUpdateMember = ref(false);
const selectedBorrower = ref<null | {
  id_group_borrower: number;
  id_borrower: number;
  full_name: string;
}>(null);
const amountsBorrower = ref<null | { amount_borrow: number; amount_interest: number }>(null);

function addMemberOpenModal() {
  selectedBorrower.value = null;
  amountsBorrower.value = null;
  modalAddUpdateMember.value = true;
}

const loadingAddEditMember = ref(false);

function updateLoadingAddMember(value: boolean) {
  loadingAddEditMember.value = value;
}

async function fnApiGroup() {
  await individualGroupStore.getApiGroup(group.value.slug as string).catch(() => { });
}

function deleteMember(id_group_borrower: number) {
  dialogStore
    .show({
      confirm: true,
      variant: 'question',
      title: '¿Deseas eliminar este miembro del grupo?',
      description: '¡Esta acción es irreversible!',
    })
    .then(async (result) => {
      if (result) {
        await individualGroupStore
          .deleteApiBorrowerGroup(id_group_borrower)
          .then((isDeleted) => {
            if (isDeleted) {
              fnApiGroup();
              toast.success('¡El miembro ha sido eliminado!');
              if (borrowers.value.length == 0 && totalPages.value > 1) {
                fnBorrowerGroup();
              }
            } else {
              toast.error('¡No se pudo eliminar el miembro!');
            }
          })
          .catch(() => {
            toast.error('¡No se pudo completar el registro!');
          });
      }
    });
}

function closeModal() {
  modalAddUpdateMember.value = false;
}

const typePaymentsReports = Object.values(Payment).map((item) => {
  return { type: item, typeName: getValuePayment(item), selected: true };
});

const modalReport = ref(false);
const loadingReport = ref(false);
const dateReport = ref(new Date());
const viewPdf = ref(false);
const pdf = ref('');

async function viewReport() {
  loadingReport.value = true;
  const date_payments = dateReport.value.toString();
  const date_payments_format = formatDate(date_payments, 'YYYY-MM-DD');

  await paymentStore
    .reportePaymentsBydateGroup(group.value.slug as string, date_payments_format, typePaymentsReports)
    .then((url_pdf) => {
      modalReport.value = false;
      dateReport.value = new Date();
      pdf.value = url_pdf;
      viewPdf.value = true;
    })
    .catch(() => {
      toast.error('¡No se pudo visualizar el reporte!')
    });

  loadingReport.value = false;
}
</script>
<template>
  <div>
    <h1 class="text-gray-600 text-lg dark:text-white">Miembros</h1>
    <div class="mt-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div class="flex gap-2">
          <r-btn @click="addMemberOpenModal">Agregar</r-btn>
          <r-btn @click="modalReport = true">Reporte</r-btn>
        </div>
        <div class="block relative md:w-64 w-full mt-2 md:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
          </span>
          <r-input v-model="inputSearchMembers" class="pl-10" @input="inputSearchDebounce" type="search"
            placeholder="busqueda"></r-input>
        </div>
      </div>
      <div class="mt-4">
        <r-table :fields="fieldsMiembros" :items="borrowers" :hidden-footer="borrowers.length == 0">
          <template #cell(full_name)="{ data }">
            <router-link :to="`/pagos/grupo/${group.slug}/prestatista/${data.slug_borrower}`"
              class="font-bold hover:underline hover:underline-offset-4 hover:cursor-pointer">{{ data.full_name }}
            </router-link>
          </template>
          <template #cell(amount_borrow)="{ data }">
            {{ moneyMxn(data.amount_borrow) }}
          </template>
          <template #cell(amount_interest)="{ data }">
            {{ moneyMxn(data.amount_interest) }}
          </template>
          <template #cell(amount_pay)="{ data }">
            {{ moneyMxn(data.amount_pay) }}
          </template>
          <template #cell(amount_payment_total)="{ data }">
            {{ moneyMxn(data.amount_payment_total) }}
          </template>
          <template #cell(amount_diff_total_charged)="{ data }">
            {{ moneyMxn(data.amount_diff_total_charged) }}
          </template>
          <template #cell(state_borrow)="{ data }">
            <div class="px-3 py-1 rounded-md font-bold text-center" :class="{
              'bg-emerald-100 text-emerald-800': data.state_borrow == Payment.paid,
              'bg-red-100 text-red-800': data.state_borrow == Payment.unpaid,
              'bg-yellow-100 text-yellow-800': data.state_borrow == Payment.inprocess,
            }">
              {{ getValuePayment(data.state_borrow) }}
            </div>
          </template>
          <template #cell(acciones)="{ data }">
            <r-btn variant="danger" class="mr-3 px-1 py-2" @click="deleteMember(data.id_group_borrower)">
              <TrashIcon class="h-5 w-5 text-white"></TrashIcon>
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
    </div>
    <r-modal v-model="modalAddUpdateMember" :loading="loadingAddEditMember" title="Agregar miembro" size="lg"
      hidden-footer>
      <template #content>
        <add-member-group :loading-save="loadingAddEditMember" @update:loading-save="updateLoadingAddMember"
          @close:modal="closeModal"></add-member-group>
      </template>
    </r-modal>
    <r-modal v-model="modalReport" :loading="loadingReport" title="Parametros del reporte" size="sm" hidden-footer
      center-modal>
      <template #content>
        <div class="w-full">
          <r-form-group title="Fecha del reporte:" class="mb-6">
            <Datepicker v-model="dateReport" teleport="#app" altPosition position="left" locale="es" autoApply
              :enableTimePicker="false" placeholder="selecciona una fecha" required />
          </r-form-group>

          <r-form-group title="Tipo de reporte:">
            <div class="flex flex-wrap gap-2 mt-2">
              <r-checkbox v-model="item.selected" v-for="(item, index) in typePaymentsReports" :key="index"
                :id="`checkbox_selected-${index}`" :name="`checkbox_selected-${index}`" variant="danger" class="mt-2"
                :label="item.typeName">
              </r-checkbox>
            </div>
          </r-form-group>
        </div>
        <div class="pt-3 text-right">
          <r-btn :disabled="!dateReport || loadingReport" @click="viewReport">
            <r-spinner class="mr-2" v-if="loadingReport"></r-spinner>
            Visualizar
          </r-btn>
        </div>
      </template>
    </r-modal>
    <modal-pdf v-model="viewPdf" title="Reporte de pagos" :pdf="pdf" :loading="loadingReport"></modal-pdf>
  </div>
</template>
