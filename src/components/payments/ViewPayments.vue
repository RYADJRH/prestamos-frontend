<script setup lang="ts">
import { ref, computed, watch, reactive, onBeforeUnmount } from 'vue';
import { useToast } from 'vue-toastification';
import { MagnifyingGlassIcon, CheckCircleIcon, CalculatorIcon } from '@heroicons/vue/24/solid';
import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { getValuePayment, Payment } from '@/interfaces/utils/Payment.interface';


import { useDebounceFn } from '@vueuse/core';
import { usePaymentStore } from '@/stores/payments.store';
import { useErrorStore } from '@/stores/error.store';

import ModalPdf from '@/components/shared_components/pdf/ModalPdf.vue';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import RPagination from '@/components/shared_components/rComponents/RPagination.vue';
import RModal from '@/components/shared_components/rComponents/RModal.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RErrorInput from '@/components/shared_components/rComponents/RErrorInput.vue';
import AdjustPayments from '@/components/payments/AdjustPayments.vue';
import { Payments } from '@/interfaces/payments.interface';

type Type = 'past-due-group' | 'next-due-group' | 'borrower-payments' | 'personal-loans';

const props = defineProps<{
    type: Type
}>();

const toast = useToast()
const errorStore = useErrorStore();
const paymentStore = usePaymentStore();
const group = computed(() => paymentStore.getGroup);
const borrower = computed(() => paymentStore.getBorrower);


const modalAdjustment = reactive<{ modal: boolean, loading: boolean, value: number, payment: Payments | null }>({
    modal: false,
    loading: false,
    value: 0,
    payment: null
});


async function fnPayments() {
    if (props.type == 'past-due-group') {
        await paymentStore.getApiPaymentsPastDue(group.value.slug, currentPage.value, inputSearchPayments.value)
            .catch(() => { });
    }

    if (props.type == 'next-due-group') {
        await paymentStore.getApiPaymentsNextDue(group.value.slug, currentPage.value, inputSearchPayments.value)
            .catch(() => { });
    }
    if (props.type == 'borrower-payments') {
        await paymentStore.getApiPaymentsBorrower(group.value.slug, borrower.value.slug, currentPage.value)
            .catch(() => { });
    }
    if (props.type == 'personal-loans') {
        await paymentStore.getApiPaymentsBorrowerPersonal(borrower.value.slug, borrower.value.id_borrow as number, currentPage.value)
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
const fullAdjusment = computed(() => paymentStore.getFullAdjusment);

const fieldsPayments = [
    { key: "num_payment", name: "No.pago" },
    { key: "date_payment", name: "Fecha abono" },
    { key: "amount_payment_period_decimal", name: "Monto abono" },
    { key: "remaining_balance_decimal", name: "Saldo restante" },
    { key: "state_payment", name: "Status" },
    { key: "options", name: "Opciones" },
]

if (!['borrower-payments', 'personal-loans'].includes(props.type)) {
    fieldsPayments.unshift({ key: "full_name", name: "Nombre" });
    fieldsPayments.pop();
}

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
    await paymentStore.updateStatePayment(props.type, selectedPayment.value.id_payment, selectedPayment.value.state_payment)
        .then(() => {
            toast.success("¡El status del pago ha sido actualizado!")
            modalUpdateStatePayment.value = false;
        })
        .catch(() => {
            toast.error("¡No se pudo completar el registro!")
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
    if (props.type == 'past-due-group') {
        await paymentStore.reportePaymentsPastDueGroup(group.value.slug)
            .then((url_pdf) => {
                pdf.value = url_pdf;
                viewPdf.value = true;
            })
            .catch(() => {
                toast.error("¡No se pudo visualizar el reporte!")
            })
    }
    if (props.type == 'next-due-group') {
        await paymentStore.reportePaymentsNextDueGroup(group.value.slug)
            .then((url_pdf) => {
                pdf.value = url_pdf;
                viewPdf.value = true;
            })
            .catch(() => {
                toast.error("¡No se pudo visualizar el reporte!");
            })
    }
    if (props.type == 'borrower-payments') {
        await paymentStore.reportePaymentsBorrowerGroup(group.value.slug, borrower.value.slug)
            .then((url_pdf) => {
                pdf.value = url_pdf;
                viewPdf.value = true;
            })
            .catch(() => {
                toast.error("¡No se pudo visualizar el reporte!")
            })
    }
    if (props.type == 'personal-loans') {
        await paymentStore.reportePaymentsBorrowerPersonalLoan(borrower.value.slug, borrower.value.id_borrow as number)
            .then((url_pdf) => {
                pdf.value = url_pdf;
                viewPdf.value = true;
            })
            .catch(() => {
                toast.error("¡No se pudo visualizar el reporte!")
            })
    }
    loadingPdf.value = false;
}

function openAdjustment(payment: Payments) {
    Object.assign(modalAdjustment, {
        modal: true,
        loading: false,
        value: payment.amount_payment_period_decimal,
        payment,
    });
}

async function saveAdjust() {
    modalAdjustment.loading = true;
    await paymentStore.adjustPayment(modalAdjustment.payment?.id_payment || -1, modalAdjustment.value, props.type === 'borrower-payments')
        .then(() => {
            toast.success('!El monto se ajusto con exito')
            fnPayments()
            modalAdjustment.modal = false
        })
        .catch((err) => {
            if (err.response.status !== 422) {
                toast.error('!El monto no se pudo ajustar!');
            }
        })
        .finally(() => {
            modalAdjustment.loading = false
        });
}

onBeforeUnmount(() => {
    errorStore.$reset()
})
</script>
<template>
    <div>
        <h1 class="text-gray-600 text-lg dark:text-white">Pagos</h1>
        <div class="mt-4">
            <div class="flex flex-col md:flex-row justify-between">
                <div>
                    <r-btn @click="fnViewPdf">
                        Reporte
                    </r-btn>
                </div>
                <div class="block relative md:w-64 w-full mt-2 md:mt-0"
                    v-if="!['borrower-payments', 'personal-loans'].includes(props.type)">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <MagnifyingGlassIcon class="h-6 w-6 text-gray-500"></MagnifyingGlassIcon>
                    </span>
                    <r-input v-model="inputSearchPayments" class="pl-10" @input="inputSearchDebounce" type="search"
                        placeholder="busqueda"></r-input>
                </div>
            </div>

        </div>
        <div class="mt-4">
            <h5 v-if="!fullAdjusment" class="text-red-900 px-2 pb-1 text-sm dark:text-gray-300 font-medium">
                Debes ajustar el ultimo pago para conseguir el monto total de la deuda.
            </h5>
            <r-table :fields="fieldsPayments" :items="payments" :hidden-footer="payments.length == 0">
                <template #cell(full_name)="{ data }" v-if="!['borrower-payments', 'personal-loans'].includes(props.type)">
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
                    <div @click="updateStatusPayment(!['borrower-payments', 'personal-loans'].includes(props.type) ? data.borrower.full_name : `No.pago ${data.num_payment}`, data.id_payment, data.state_payment)"
                        class="px-3 py-1 rounded-md font-bold text-center hover:underline hover:underline-offset-4 hover:cursor-pointer "
                        :class="{
                            'bg-emerald-100 text-emerald-800': data.state_payment == Payment.paid,
                            'bg-red-100 text-red-800': data.state_payment == Payment.unpaid,
                            'bg-yellow-100 text-yellow-800': data.state_payment == Payment.inprocess,
                        }">
                        {{ getValuePayment(data.state_payment) }}
                    </div>
                </template>
                <template #cell(options)="{ data }">
                    <div class="flex gap-2">
                        <r-btn @click="openAdjustment(data as Payments)">Ajustar</r-btn>
                        <r-btn @click="data.toogle()" type="button" v-if="data.adjust_payment.length > 0">Historial</r-btn>
                    </div>
                </template>
                <template #row-details="{ data }">
                    <div class="p-4">
                        <div class="w-full px-3 py-2 bg-gray-100 rounded-md dark:bg-gray-800">
                            <adjust-payments :adjust="data.adjust_payment" />
                        </div>
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
        <r-modal v-model="modalUpdateStatePayment" :loading="loadingUpdateStatePayment" title="Editar status" hidden-footer>
            <template #content>
                <div class="p-3 flex items-center justify-between rounded-md bg-gray-600/5 mb-3 ">
                    <p class="font-bold dark:text-gray-300"> {{ selectedPayment.full_name }}</p>
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
                    <r-btn class="flex justify-center items-center" :disabled="loadingUpdateStatePayment"
                        @click="saveStatePayment">
                        <r-spinner v-if="loadingUpdateStatePayment" size="btn" class="mr-3"></r-spinner>
                        Guardar
                    </r-btn>
                </div>
            </template>
        </r-modal>
        <r-modal v-model="modalAdjustment.modal" title="Ajustar pago" :loading="modalAdjustment.loading" hidden-footer>
            <template #content>
                <div class="p-3 flex items-center justify-between rounded-md bg-gray-600/5 mb-3 ">
                    <p class="font-bold dark:text-gray-300"> No.pago {{ modalAdjustment.payment?.num_payment }}</p>
                </div>
                <form @submit.prevent="saveAdjust">
                    <r-form-group title="Monto de ajuste:">
                        <r-input v-model="modalAdjustment.value" :disabled="modalAdjustment.loading" type="text"
                            class="text-right" currency required></r-input>
                        <r-error-input :errors="errorStore.errors" field="amount_payment">
                        </r-error-input>
                    </r-form-group>

                    <div class="flex justify-end mt-3">
                        <r-btn type="submit" class="flex justify-center items-center" :disabled="modalAdjustment.loading">
                            <r-spinner class="mr-2" v-if="modalAdjustment.loading" size="btn"></r-spinner>
                            Guardar
                        </r-btn>
                    </div>
                </form>
            </template>
        </r-modal>
        <modal-pdf v-model="viewPdf" title="Reporte de pagos" :pdf="pdf" :loading="loadingPdf"></modal-pdf>
    </div>
</template>