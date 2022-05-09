<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { SearchIcon, CheckCircleIcon, DocumentDownloadIcon } from '@heroicons/vue/solid';
import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { getValuePayment, Payment } from '@/interfaces/utils/Payment.interface';


import { useDebounceFn } from '@vueuse/core';
import { usePaymentStore } from '@/stores/payments.store';
import { useDialogStore } from '@/stores/dialog.store';

import ModalPdf from '@/components/shared_components/pdf/ModalPdf.vue';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import RPagination from '@/components/shared_components/rComponents/RPagination.vue';
import RModal from '@/components/shared_components/rComponents/RModal.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';

type Type = 'past-due-group';

const props = defineProps<{
    type: Type
}>();

const paymentStore = usePaymentStore();
const dialogStore = useDialogStore();
const group = computed(() => paymentStore.getGroup);


async function fnPayments() {
    if (props.type == 'past-due-group') {
        await paymentStore.getApiPaymentsPastDue(group.value.slug, currentPage.value, inputSearchPayments.value)
            .catch(() => { });
    }
}

const loadingDataPayments = ref(false);
const inputSearchPayments = ref('');
const inputSearchDebounce = useDebounceFn(
    async () => {
        loadingDataPayments.value = true;
        await fnPayments();
        loadingDataPayments.value = false;
    },
    500,
    { maxWait: 1000 }
);

const currentPage = computed({
    get() {
        return paymentStore.getCurrentPagePayments;
    },
    async set(page: number) {
        paymentStore.setCurrentPagePayment(page);
        await fnPayments();
    },
});

const totalPages = computed({
    get() {
        return paymentStore.getTotalPagesPayments;
    },
    set(pages: number) {
        paymentStore.setTotalPagePayments(pages);
    },
});


const fieldsPayments = [
    { key: "full_name", name: "Nombre" },
    { key: "num_payment", name: "No.pago" },
    { key: "date_payment", name: "Fecha abono" },
    { key: "amount_payment_period_decimal", name: "Monto abono" },
    { key: "remaining_balance_decimal", name: "Saldo restante" },
    { key: "state_payment", name: "Status" },
]
const payments = computed(() => paymentStore.getPayments);

const modalUpdateStatePayment = ref(false);
const loadingUpdateStatePayment = ref(false);

const initSelectedPayment = {
    id_payment: -1,
    full_name: '',
    state_payment: Payment.unpaid
}

const selectedPayment = ref<{ full_name: string, id_payment: number, state_payment: Payment }>({ ...initSelectedPayment });

function updateStatusPayment(full_name: string, id_payment: number, state_payment: Payment) {
    selectedPayment.value = { full_name, id_payment, state_payment };
    modalUpdateStatePayment.value = true;
}
async function saveStatePayment() {
    loadingUpdateStatePayment.value = true;
    await paymentStore.updateStatePayment(selectedPayment.value.id_payment, selectedPayment.value.state_payment)
        .then(() => {
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
        selectedPayment.value = { ...initSelectedPayment };
    }
})



const viewPdf = ref(false);
const loadingPdf = ref(false);
const pdf = ref('');

async function fnViewPdf() {
    pdf.value = '';
    loadingPdf.value = true;
    await paymentStore.reportePaymentsPastDueGroup(group.value.slug)
        .then((url_pdf) => {
            pdf.value = url_pdf;
            viewPdf.value = true;
        })
        .catch(() => {
            dialogStore.show({
                variant: "error",
                title: "Ha ocurrido un error",
                description: "¡No se pudo visualizar el reporte!",
            });
        })
    loadingPdf.value = false;
}

</script>
<template>
    <div>
        <h1 class="text-gray-600 text-lg">Pagos</h1>
        <div class="mt-4">
            <div class="flex flex-col md:flex-row justify-between">
                <div>
                    <r-btn @click="fnViewPdf">
                        <DocumentDownloadIcon class="h-6 w-6 text-white mr-2"></DocumentDownloadIcon>
                        Reporte
                    </r-btn>
                </div>
                <div class="block relative md:w-64 w-full mt-2 md:mt-0">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
                    </span>
                    <r-input v-model="inputSearchPayments" class="pl-10" @input="inputSearchDebounce" type="search"
                        placeholder="busqueda"></r-input>
                </div>
            </div>

        </div>
        <div class="mt-4">
            <r-table :fields="fieldsPayments" :items="payments" :hidden-footer="payments.length == 0">

                <template #cell(full_name)="{ data }">
                    <span class="font-bold">{{ data.borrower.full_name }}</span>
                </template>
                <template #cell(date_payment)="{ data }">
                    {{ formatDate(data.date_payment, "LL") }}
                </template>
                <template #cell(amount_payment_period_decimal)="{ data }">
                    {{ moneyMxn(data.amount_payment_period_decimal) }}
                </template>
                <template #cell(remaining_balance_decimal)="{ data }">
                    {{ moneyMxn(data.remaining_balance_decimal) }}
                </template>

                <template #cell(state_payment)="{ data }">
                    <div @click="updateStatusPayment(data.borrower.full_name, data.id_payment, data.state_payment)"
                        class="px-3 py-1 rounded-md font-bold text-center hover:underline hover:underline-offset-4 hover:cursor-pointer"
                        :class="{
                            'bg-emerald-100 text-emerald-800': data.state_payment == Payment.paid,
                            'bg-red-100 text-red-800': data.state_payment == Payment.unpaid,
                            'bg-yellow-100 text-yellow-800': data.state_payment == Payment.inprocess,
                        }">
                        {{ getValuePayment(data.state_payment) }}
                    </div>
                </template>
                <template #label-empty>
                    Sin pagos
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


        <r-modal v-model="modalUpdateStatePayment" :loading="loadingUpdateStatePayment" title="Editar status"
            hidden-footer>
            <template #content>
                <div class="p-3 flex items-center justify-between rounded-md bg-gray-600/5 mb-3">
                    <p class="font-bold"> {{ selectedPayment.full_name }}</p>
                </div>
                <div v-for="item in Payment" @click="selectedPayment.state_payment = item"
                    class="mb-3 px-3 py-1 rounded-md font-bold text-center hover:cursor-pointer" :class="{
                        'bg-emerald-100 text-emerald-800 ': item == Payment.paid,
                        'bg-red-100 text-red-800': item == Payment.unpaid,
                        'bg-yellow-100 text-yellow-800': item == Payment.inprocess
                    }">
                    <CheckCircleIcon class="w-6 h-6 absolute" v-if="selectedPayment.state_payment == item">
                    </CheckCircleIcon>
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
        <modal-pdf v-model="viewPdf" title="Pagos vencidos" :pdf="pdf" :loading="loadingPdf"></modal-pdf>
    </div>
</template>