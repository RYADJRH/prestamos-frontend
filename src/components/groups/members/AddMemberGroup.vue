<script setup lang="ts">
import { computed, ref, markRaw, reactive, onBeforeUnmount, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useToast } from 'vue-toastification';

import { XCircleIcon } from '@heroicons/vue/24/solid';
import { lockDays } from '@/interfaces/utils/DayWeek.interface';

import { moneyMxn } from "@/utils/currency";
import { formatDate } from '@/utils/dates';
import { useAddMemberGroup } from '@/stores/addMemberGroup.store';
import { useIndividualGroupStore } from '@/stores/individualGroup.store';

import { Group } from '@/interfaces/group.interface';
import { BorrowerGroupResponse } from '@/interfaces/borrower.interface';

import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RSelectList from '@/components/shared_components/rComponents/RSelectList.vue';
import RSelect from '@/components/shared_components/rComponents/RSelect.vue';
import ItemListCardBorrowers from "@/components/groups/members/ItemListCardBorrowers.vue";
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';
import RErrorInput from '@/components/shared_components/rComponents/RErrorInput.vue';

const itemList = markRaw(ItemListCardBorrowers);

const loading = ref(false);
const toast = useToast();
const addMemberGroupStore = useAddMemberGroup();
const individualGroupStore = useIndividualGroupStore();

const loadingDataBorrower = ref(false);
const searchBorrower = ref("");

const group = computed(() => {
    return individualGroupStore.getGroup as Group;
});

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

const inputSearchDebounce = useDebounceFn(
    async () => {
        loadingDataBorrower.value = true;
        await addMemberGroupStore.listBorrowers(searchBorrower.value, group.value.slug as string);
        loadingDataBorrower.value = false;
    },
    500,
    { maxWait: 1000 }
);
const dataSyncSearch = computed(() => addMemberGroupStore.getBorrowerList);

const initBorrower = {
    id_borrower: -1,
    slug_group: group.value.slug as string,
    amount_borrow: 0,
    amount_interest: 0,
    amount_payment_period: 0,
    date_init_payment: null,
    payment_every_n_weeks: 1
}

const borrower = reactive({ ...initBorrower });

const selectedBorrower = ref<null | {
    id_borrower: number;
    full_name: string;
}>(null);


function selectBorrower(borrowerR: BorrowerGroupResponse) {
    const { id_borrower, full_name } = borrowerR;
    borrower.id_borrower = id_borrower;
    selectedBorrower.value = { id_borrower, full_name };
}

function removeSelectedBorrower() {
    addMemberGroupStore.setAmortization([]);
    Object.assign(borrower, { ...initBorrower });
    borrower.id_borrower = -1;
    selectedBorrower.value = null;
}

const itemsEveryWeeks = [
    { value: 1, text: "1" },
    { value: 2, text: "2" },
    { value: 3, text: "3" },
    { value: 4, text: "4" },
]

const fieldsAmortization = [
    { key: 'num_payment', name: 'No.pago' },
    { key: 'date_payment', name: 'Fecha pago' },
    { key: 'amount_payment_period', name: 'Monto de abono' },
    { key: 'remaining_balance', name: 'Saldo restante' }
]

const itemsAmortization = computed(() => addMemberGroupStore.getAmortization);

async function fnTablaAmortization() {
    addMemberGroupStore.setAmortization([]);
    const amount_borrow = borrower.amount_borrow;
    const amount_interest = borrower.amount_interest;
    const amount_pay = amount_borrow + amount_interest;
    const amount_payment_period = borrower.amount_payment_period;
    const date_init_payment = borrower.date_init_payment;
    const payment_every_n_weeks = borrower.payment_every_n_weeks;


    if ((amount_pay > 0 && amount_payment_period > 0) && (amount_pay >= amount_payment_period) && date_init_payment != null) {
        const date_init_payment_format = formatDate(date_init_payment, 'YYYY-MM-DD');
        loading.value = true;
        await addMemberGroupStore.calculatedAmortization(
            {
                amount_borrow,
                amount_interest,
                amount_payment_period,
                date_init_payment: date_init_payment_format,
                payment_every_n_weeks
            }
        ).catch(() => { })
            .finally(() => { loading.value = false })
    }

}

const inputAmortionCalculedDebounce = useDebounceFn(
    async () => {
        await fnTablaAmortization();
    },
    500,
    { maxWait: 1000 }
);

async function saveBorrower() {
    const slug_group = group.value.slug as string;
    const id_borrower = borrower.id_borrower;
    const amount_borrow = borrower.amount_borrow;
    const amount_interest = borrower.amount_interest;
    const amount_payment_period = borrower.amount_payment_period;
    const date_init_payment = borrower.date_init_payment + "";
    const date_init_payment_format = formatDate(date_init_payment, 'YYYY-MM-DD');
    const payment_every_n_weeks = borrower.payment_every_n_weeks;

    emits('update:loadingSave', true);
    await addMemberGroupStore.addMember({
        id_borrower,
        slug_group,
        amount_borrow,
        amount_interest,
        amount_payment_period,
        date_init_payment: date_init_payment_format,
        payment_every_n_weeks
    })
        .then(async (member) => {
            individualGroupStore.setMember(member);
            await individualGroupStore.getApiGroup(group.value.slug as string).catch(() => { });
            toast.success("¡El nuevo miembro ha sido agregado!");
            addMemberGroupStore.$reset();
            searchBorrower.value = "";
            selectedBorrower.value = null;
            Object.assign(borrower, { ...initBorrower });
        })
        .catch((err) => {
            if (err.response.status == 302) {
                toast.success("¡No se pudo completar el registro!");
                emits("close:modal");
            }
        })
    emits('update:loadingSave', false);
}

const validatorAmountPeriod = ref(false);
watch(borrower, (value) => {
    const total = value.amount_borrow + value.amount_interest;
    validatorAmountPeriod.value = value.amount_payment_period > total
})

onBeforeUnmount(() => {
    emits('update:loadingSave', false);
    addMemberGroupStore.$reset();
})

</script>

<template>
    <form @submit.prevent="saveBorrower">
        <div class="w-full md:mb-4 mb-0">
            <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/3 px-2 flex items-center">
                    <r-form-group title="Busca y selecciona un prestatario:" class="mb-3 w-full" v-if="!selectedBorrower">
                        <r-select-list v-model="searchBorrower" @input="inputSearchDebounce" :data="dataSyncSearch"
                            :item-layout="itemList" @click:item="selectBorrower" :loading="loadingDataBorrower">
                        </r-select-list>
                    </r-form-group>
                    <div class="w-full p-3 flex items-center justify-between rounded-md bg-gray-600/5 mb-3 dark:bg-gray-800 dark:text-white"
                        v-else>
                        <p class="w-80 font-bold">{{ selectedBorrower?.full_name }}</p>
                        <div class="w-20 flex justify-end" v-if="selectedBorrower && !loadingSave">
                            <XCircleIcon class="h-8 w-8 text-red-800 cursor-pointer " @click="removeSelectedBorrower">
                            </XCircleIcon>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/3 px-2">
                    <r-form-group title="Fecha del primer pago:" class="mb-3">
                        <Datepicker v-model="borrower.date_init_payment" @update:modelValue="fnTablaAmortization"
                            :disabledWeekDays="lockDays(group.day_payment)" locale="es" autoApply :enableTimePicker="false"
                            position="center" teleport="#app" placeholder="selecciona una fecha"
                            :disabled="!selectedBorrower" required />
                    </r-form-group>
                </div>
                <div class="w-full md:w-1/3 px-2">
                    <r-form-group title="Periodo de pagos (semana):" class="mb-3">
                        <r-select v-model="borrower.payment_every_n_weeks" :items="itemsEveryWeeks"
                            :disabled="!selectedBorrower" @change="fnTablaAmortization" required></r-select>
                    </r-form-group>
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
                        <r-input v-model="borrower.amount_payment_period" @input="inputAmortionCalculedDebounce" type="text"
                            class="text-right" :disabled="!selectedBorrower" :stateError="validatorAmountPeriod" currency
                            required></r-input>

                        <r-error-input :show="validatorAmountPeriod"
                            :errors="{ total_amount: ['El monto del abono debe ser menor'] }" field="total_amount">
                        </r-error-input>
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
            <r-btn type="submit" class="flex justify-center items-center"
                :disabled="itemsAmortization.length == 0 || loadingSave">
                <r-spinner class="mr-2" v-if="loadingSave" size="btn"></r-spinner>
                Guardar
            </r-btn>
        </div>
    </form>
</template>