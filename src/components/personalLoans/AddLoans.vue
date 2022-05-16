

<script setup lang="ts">
import { computed, ref, markRaw, reactive, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { XCircleIcon } from '@heroicons/vue/solid';

import ItemListCardBorrowers from "@/components/groups/members/ItemListCardBorrowers.vue";
import { formatDate } from '@/utils/dates';
import { moneyMxn } from "@/utils/currency";

import { TypePeriod } from '@/interfaces/utils/TypePeriodsLoans.interface';
import { BorrowerAddLoans } from '@/interfaces/individualLoans.interface';
import { Payment } from '@/interfaces/utils/Payment.interface';

import { useInvidualLoansStore } from '@/stores/individualLoans.store';
import { useDialogStore } from "@/stores/dialog.store";
import { useAddLoansStore } from '@/stores/addLoans.store';
import { useAuthStore } from "@/stores/auth.store";
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RSelectList from '@/components/shared_components/rComponents/RSelectList.vue';
import RSelect from '@/components/shared_components/rComponents/RSelect.vue';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';

const individualLoansStore = useInvidualLoansStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const addLoansStore = useAddLoansStore();
const itemList = markRaw(ItemListCardBorrowers);

const emits = defineEmits<{
    (e: 'update:loadingSave', value: boolean): void,
    (e: "close:modal"): void;
}>();

const props = withDefaults(
    defineProps<{ loadingSave?: boolean; }>(),
    {
        loadingSave: false,
    }
);

const initBorrower = {
    id_borrower: -1,
    amount_borrow: 0,
    amount_interest: 0,
    amount_payment_period: 0,
    date_init_payment: null,
    type_period: TypePeriod.nweeks,
    payment_every_n: 1
}

const borrower = reactive({ ...initBorrower });
const selectedBorrower = ref<null | {
    id_borrower: number;
    full_name: string;
}>(null);

const searchBorrower = ref("");
const loadingDataBorrower = ref(false);
const inputSearchDebounce = useDebounceFn(
    async () => {
        loadingDataBorrower.value = true;
        await addLoansStore.listBorrowers(searchBorrower.value, authStore.profileBeneficiary?.id_beneficiary as number);
        loadingDataBorrower.value = false;
    },
    500,
    { maxWait: 1000 }
);

const dataSyncSearch = computed(() => addLoansStore.getBorrowerList);


function selectBorrower(borrowerR: BorrowerAddLoans) {
    const { id_borrower, full_name } = borrowerR;
    borrower.id_borrower = id_borrower;
    selectedBorrower.value = { id_borrower, full_name };
}

function removeSelectedBorrower() {
    addLoansStore.setAmortization([]);
    Object.assign(borrower, { ...initBorrower });
    selectedBorrower.value = null;
}

const itemsTypePeriod = [
    { value: TypePeriod.nmonths, text: 'En N meses' },
    { value: TypePeriod.nweeks, text: "En N semanas" },
    { value: TypePeriod.ndays, text: "En N dias" },
]

const inputAmortionCalculedDebounce = useDebounceFn(
    async () => {
        await fnTablaAmortization();
    },
    500,
    { maxWait: 1000 }
);

const fieldsAmortization = [
    { key: 'num_payment', name: 'No.pago' },
    { key: 'date_payment', name: 'Fecha pago' },
    { key: 'amount_payment_period', name: 'Monto de abono' },
    { key: 'remaining_balance', name: 'Saldo restante' }
];

const itemsAmortization = computed(() => addLoansStore.getAmortization);

async function fnTablaAmortization() {
    addLoansStore.setAmortization([]);
    const amount_borrow = borrower.amount_borrow;
    const amount_interest = borrower.amount_interest;
    const amount_pay = amount_borrow + amount_interest;
    const amount_payment_period = borrower.amount_payment_period;
    const date_init_payment = borrower.date_init_payment;
    const type_period = borrower.type_period;
    const payment_every_n = borrower.payment_every_n;


    if ((amount_pay > 0 && amount_payment_period > 0) && (amount_pay >= amount_payment_period) && date_init_payment != null) {
        const date_init_payment_format = formatDate(date_init_payment, 'YYYY-MM-DD');
        await addLoansStore.calculatedAmortizationLoans(
            {
                amount_borrow,
                amount_interest,
                amount_payment_period,
                date_init_payment: date_init_payment_format,
                type_period,
                payment_every_n
            }
        ).catch(() => { })
    }

}

async function saveLoans() {

    const id_borrower = borrower.id_borrower;
    const amount_borrow = borrower.amount_borrow;
    const amount_interest = borrower.amount_interest;
    const amount_payment_period = borrower.amount_payment_period;
    const date_init_payment = borrower.date_init_payment + "";
    const date_init_payment_format = formatDate(date_init_payment, 'YYYY-MM-DD');
    const type_period = borrower.type_period;
    const payment_every_n = borrower.payment_every_n;

    emits('update:loadingSave', true);

    await addLoansStore.addLoans({
        id_borrower,
        amount_borrow,
        amount_interest,
        amount_payment_period,
        date_init_payment: date_init_payment_format,
        type_period,
        payment_every_n
    })
        .then(async (loan) => {
            if (individualLoansStore.getStatusLoans == Payment.inprocess) {
                individualLoansStore.setLoan(loan);
            }

            await fnAmountsLoans();
            dialogStore
                .show({
                    variant: "success",
                    title: "Registro exitoso",
                    description: "¡El nuevo prestamo ha sido agregado!",
                })
                .then(() => {
                    addLoansStore.$reset();
                    searchBorrower.value = "";
                    selectedBorrower.value = null;
                    Object.assign(borrower, { ...initBorrower });
                });
        })
        .catch((err) => {
            dialogStore
                .show({
                    variant: "error",
                    title: "Registro Fallo",
                    description: "¡No se pudo completar el registro!",
                })
        })
    emits('update:loadingSave', false);
}

async function fnAmountsLoans() {
    await individualLoansStore.getApiAmountsLoans(authStore.profileBeneficiary?.id_beneficiary as number)
        .catch(() => { });
}

onBeforeUnmount(() => {
    emits('update:loadingSave', false);
    dialogStore.$reset();
    addLoansStore.$reset();
})
</script>

<template>
    <form @submit.prevent="saveLoans">
        <div class="w-full md:mb-4 mb-0">
            <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/3 px-2 flex items-center">
                    <r-form-group title="Busca y selecciona un prestatario:" class="mb-3 w-full"
                        v-if="!selectedBorrower">
                        <r-select-list v-model="searchBorrower" @input="inputSearchDebounce" :data="dataSyncSearch"
                            :item-layout="itemList" @click:item="selectBorrower" :loading="loadingDataBorrower">
                        </r-select-list>
                    </r-form-group>
                    <div class="w-full p-3 flex items-center justify-between rounded-md bg-gray-600/5 mb-3" v-else>
                        <p class="w-80 font-bold">{{ selectedBorrower?.full_name }}</p>
                        <div class="w-20 flex justify-end" v-if="selectedBorrower && !loadingSave">
                            <XCircleIcon class="h-8 w-8 text-red-800 cursor-pointer" @click="removeSelectedBorrower">
                            </XCircleIcon>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/3 px-2">
                    <r-form-group title="Fecha del primer pago:" class="mb-3">
                        <Datepicker v-model="borrower.date_init_payment" @update:modelValue="fnTablaAmortization"
                            locale="es" autoApply :enableTimePicker="false" position="center" teleport="#app"
                            placeholder="selecciona una fecha" :disabled="!selectedBorrower" required />
                    </r-form-group>
                </div>
                <div class="w-full md:w-1/3 px-2">
                    <div class="flex flex-wrap -mx-2">
                        <div class="w-full md:w-2/3 px-2">
                            <r-form-group title="Tipo de periodo:" class="mb-3">
                                <r-select v-model="borrower.type_period" :items="itemsTypePeriod"
                                    :disabled="!selectedBorrower" @change="fnTablaAmortization" required></r-select>
                            </r-form-group>
                        </div>
                        <div class="w-full md:w-1/3 px-2">
                            <r-form-group title="Periodo:" class="mb-3">
                                <r-input v-model="borrower.payment_every_n" @input="inputAmortionCalculedDebounce"
                                    type="text" class="text-right" :disabled="!selectedBorrower" currency
                                    :prependCurrency="''" :min-currency="1" required>
                                </r-input>
                            </r-form-group>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="w-full mb-4">
            <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/3 px-2">
                    <r-form-group title="Monto prestado:" class="mb-3">
                        <r-input v-model="borrower.amount_borrow" @input="inputAmortionCalculedDebounce" type="text"
                            class="text-right" :disabled="!selectedBorrower" currency required></r-input>
                    </r-form-group>
                </div>
                <div class="w-full md:w-1/3 px-2">
                    <r-form-group title="Monto interes:" class="mb-3">
                        <r-input v-model="borrower.amount_interest" @input="inputAmortionCalculedDebounce" type="text"
                            class="text-right" :disabled="!selectedBorrower" currency required></r-input>
                    </r-form-group>
                </div>

                <div class="w-full md:w-1/3 px-2">
                    <r-form-group title="Monto de abono:" class="mb-3">
                        <r-input v-model="borrower.amount_payment_period" @input="inputAmortionCalculedDebounce"
                            type="text" class="text-right" :disabled="!selectedBorrower" currency required></r-input>
                    </r-form-group>
                </div>
            </div>
        </div>
        <div class="w-full">
            <r-table :fields="fieldsAmortization" :items="itemsAmortization" hidden-footer shadow-none>
                <template #cell(date_payment)="{ data }">
                    {{ formatDate(data.date_payment, 'LL') }}
                </template>

                <template #cell(amount_payment_period)="{ data }">
                    {{ moneyMxn(data.amount_payment_period) }}
                </template>
                <template #cell(remaining_balance)="{ data }">
                    {{ moneyMxn(data.remaining_balance) }}
                </template>
                <template #label-empty> No se ha calculado la amortización </template>
            </r-table>
        </div>
        <div class="flex justify-end mt-3">
            <r-btn type="submit" :disabled="itemsAmortization.length == 0 || loadingSave">
                <r-spinner class="mr-2" v-if="loadingSave"></r-spinner>
                Guardar
            </r-btn>
        </div>
    </form>
</template>