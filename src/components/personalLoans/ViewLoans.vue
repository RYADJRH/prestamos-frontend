<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useToast } from 'vue-toastification';

import { usePaymentStore } from '@/stores/payments.store';
import { useAuthStore } from '@/stores/auth.store';
import { useInvidualLoansStore } from '@/stores/individualLoans.store';
import { useDialogStore } from "@/stores/dialog.store";

import { moneyMxn } from "@/utils/currency";
import { formatDate } from '@/utils/dates';

import { getValuePayment, Payment } from '@/interfaces/utils/Payment.interface';

import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/vue/24/solid';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import RPagination from '@/components/shared_components/rComponents/RPagination.vue';
import RModal from '@/components/shared_components/rComponents/RModal.vue';
import AddLoans from '@/components/personalLoans/AddLoans.vue';
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RSelect from '@/components/shared_components/rComponents/RSelect.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';
import RCheckbox from '@/components/shared_components/rComponents/RCheckbox.vue';
import ModalPdf from '@/components/shared_components/pdf/ModalPdf.vue';

const toast = useToast()
const paymentStore = usePaymentStore();
const authStore = useAuthStore();
const individualLoansStore = useInvidualLoansStore();
const dialogStore = useDialogStore();

async function fnGetLoans() {
    await individualLoansStore.getApiLoans(authStore.profileBeneficiary?.id_beneficiary as number, currentPage.value, inputSearchLoans.value, filterPersonaLoans.value)
        .catch(() => { });
}

const inputSearchLoans = ref('');
const inputSearchDebounce = useDebounceFn(
    async () => {
        await fnGetLoans();
    },
    500,
    { maxWait: 1000 }
);

const currentPage = computed({
    get() {
        return individualLoansStore.getCurrentPageLoans;
    },
    async set(page: number) {
        individualLoansStore.setCurrentPageLoans(page);
        await fnGetLoans();
    },
});

const totalPages = computed({
    get() {
        return individualLoansStore.getTotalPagesLoans;
    },
    set(pages: number) {
        individualLoansStore.setTotalPageLoans(pages);
    },
});

const fieldsLoans = [
    { key: "full_name", name: "Nombre" },
    { key: "amount_borrow", name: "Prestado" },
    { key: "amount_interest", name: "Intereses" },
    { key: "amount_pay", name: "A pagar" },
    { key: "amount_payment_total", name: "Pagado" },
    { key: "amount_diff_total_charged", name: "Restante" },
    { key: "number_payments", name: "Pagos" },
    { key: "state_borrow", name: "Status" },
    { key: "acciones", name: "Acciones" },
];
const loans = computed(() => individualLoansStore.getLoans);


const modalAddLoans = ref(false);
const loadingAddLoans = ref(false);

function closeModal() {
    modalAddLoans.value = false;
}

function updateLoadingAddLoans(value: boolean) {
    loadingAddLoans.value = value;
}

const filterPersonaLoans = computed({
    get() {
        return individualLoansStore.getStatusLoans;
    },
    set(value: Payment) {
        individualLoansStore.setStatusLoans(value);
    }
})

const itemsFilterPersonalLoans =
    [
        { value: Payment.inprocess, text: getValuePayment(Payment.inprocess) },
        { value: Payment.unpaid, text: getValuePayment(Payment.unpaid) },
        { value: Payment.paid, text: getValuePayment(Payment.paid) },
    ]

async function changeFilterPersonalLoans() {
    await fnGetLoans();
}

async function fnAmountsLoans() {
    await individualLoansStore.getApiAmountsLoans(authStore.profileBeneficiary?.id_beneficiary as number)
        .catch(() => { });
}

function detelePersonalLoans(id_borrow: number) {
    dialogStore
        .show({
            confirm: true,
            variant: "question",
            title: "¿Deseas eliminar este prestamo?",
            description: "¡Esta acción es irreversible!",
        })
        .then(async (result) => {
            if (result) {
                await individualLoansStore
                    .deleteLoans(id_borrow)
                    .then(async (isDeleted) => {
                        if (isDeleted) {
                            await fnAmountsLoans();
                            toast.success("¡El prestamo ha sido eliminado!")
                            if (loans.value.length == 0 && totalPages.value > 1) {
                                await fnGetLoans();
                            }
                        } else {
                            toast.error("¡No se pudo eliminar el prestamo!")
                        }
                    })
                    .catch(() => {
                        toast.error("¡No se pudo completar el registro!")
                    });
            }
        })

}

const typePaymentsReports = Object.values(Payment).map((item) => { return { type: item, typeName: getValuePayment(item), selected: true } });


const modalReport = ref(false);
const loadingReport = ref(false);
const dateReport = ref(new Date());
const viewPdf = ref(false);
const pdf = ref('');

async function viewReport() {
    loadingReport.value = true;
    const id_beneficiary = authStore.profileBeneficiary?.id_beneficiary as number;
    const date_payments = dateReport.value + "";
    const date_payments_format = formatDate(date_payments, 'YYYY-MM-DD');

    await paymentStore.reportePaymentsBeneficiaryPersonalLoan(id_beneficiary, date_payments_format, typePaymentsReports)
        .then((url_pdf) => {
            modalReport.value = false;
            dateReport.value = new Date();
            pdf.value = url_pdf;
            viewPdf.value = true;
        })
        .catch(() => {
            toast.error("¡No se pudo visualizar el reporte!")
        })

    loadingReport.value = false;
}

onBeforeUnmount(() => {
    paymentStore.$reset();
})

</script>
<template>
    <div>
        <div class="md:flex md:justify-between">
            <div class="flex items-end">
                <div class="block">
                    <r-btn class="mr-2" @click="modalAddLoans = true">
                        Nuevo prestamo
                    </r-btn>
                    <r-btn class="mr-2" @click="modalReport = true">
                        Reporte
                    </r-btn>
                </div>
            </div>

            <div class="md:flex block">
                <div class="flex items-end">
                    <div class="block relative md:mr-3 md:w-64 w-full mt-2 md:mt-0">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                            <MagnifyingGlassIcon class="h-6 w-6 text-gray-500"></MagnifyingGlassIcon>
                        </span>
                        <r-input v-model="inputSearchLoans" @input="inputSearchDebounce" class="pl-10" type="search"
                            placeholder="busqueda"></r-input>
                    </div>
                </div>
                <r-form-group title="Status:" class="mt-2">
                    <r-select v-model="filterPersonaLoans" :items="itemsFilterPersonalLoans"
                        @change="changeFilterPersonalLoans" class="md:w-40 w-full mt-2 md:mt-0"></r-select>
                </r-form-group>
            </div>

        </div>
        <div class="mt-4">
            <r-table :fields="fieldsLoans" :items="loans" :hidden-footer="loans.length == 0">
                <template #cell(full_name)="{ data }">
                    <router-link :to="`/prestamos-personales/pagos/${data.slug}/${data.id_borrow}`"
                        class="font-bold hover:underline hover:underline-offset-4 hover:cursor-pointer">{{
                            data.full_name
                        }}</router-link>
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
                    <r-btn variant="danger" class="mr-2 w-8 grid place-content-center" @click="detelePersonalLoans(data.id_borrow)">
                        <TrashIcon class="h-4 w-4 text-white"></TrashIcon>
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
        <r-modal v-model="modalAddLoans" :loading="loadingAddLoans" title="Nuevo prestamo personal" size="lg" hidden-footer>
            <template #content>
                <add-loans :loading-save="loadingAddLoans" @update:loading-save="updateLoadingAddLoans"
                    @close:modal="closeModal"></add-loans>
            </template>
        </r-modal>

        <r-modal v-model="modalReport" :loading="loadingReport" title="Parametros del reporte" size="sm" hidden-footer
            center-modal>
            <template #content>
                <p class="mb-4 text-red-800 font-bold dark:text-gray-300">
                    Nota: Para pagos atrasados solo se mostraran
                    los pagos de 5
                    meses atras a partir de la
                    fecha
                    seleccionada</p>
                <div class="w-full">
                    <r-form-group title="Fecha del reporte:" class="mb-6">
                        <Datepicker v-model="dateReport" teleport="#app" position="left" locale="es" autoApply
                            :enableTimePicker="false" placeholder="selecciona una fecha" required />
                    </r-form-group>

                    <r-form-group title="Tipo de reporte:">
                        <div class="flex flex-wrap gap-2 mt-2">

                            <r-checkbox v-model="item.selected" v-for="(item, index) in typePaymentsReports" :key="index"
                                :id="`checkbox_selected-${index}`" :name="`checkbox_selected-${index}`" variant="danger"
                                class="mt-2" :label="item.typeName">
                            </r-checkbox>

                        </div>
                    </r-form-group>
                </div>
                <div class="pt-3 flex justify-end">
                    <r-btn class="flex justify-center items-center" :disabled="!dateReport || loadingReport"
                        @click="viewReport">
                        <r-spinner class="mr-2" size="btn" v-if="loadingReport"></r-spinner>
                        Visualizar
                    </r-btn>
                </div>
            </template>
        </r-modal>
        <modal-pdf v-model="viewPdf" title="Reporte de pagos" :pdf="pdf" :loading="loadingReport"></modal-pdf>

    </div>
</template>