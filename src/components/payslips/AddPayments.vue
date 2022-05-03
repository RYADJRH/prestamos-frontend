<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { usePayslipGroupStore } from "@/stores/payslipGroup.store";
import { useDialogStore } from "@/stores/dialog.store";

import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RCheckbox from "@/components/shared_components/rComponents/RCheckbox.vue";
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';


const payslipGroupStore = usePayslipGroupStore();
const dialogStore = useDialogStore();
const payslip = computed(() => payslipGroupStore.getPayslip);

const props = defineProps<{ loadingSave: boolean }>();


const emits = defineEmits<{
    (e: "update:loading", value: boolean): void;
    (e: "update:payments-payslip"): void;
}>();

const fieldsAddPayment = [
    { key: "full_name", name: "Nombre" },
    { key: "amount_payment", name: "Total a abonar" },
];

const addPayments = computed(() => payslipGroupStore.getAddPaymentsMembers);

async function fnGetAddPaymentsMember() {
    await payslipGroupStore.getaddPaymentsMemberPayslip(payslip.value.slug).catch(() => { });
}

async function fnSavePaymentsMembers() {
    emits("update:loading", true);
    await payslipGroupStore
        .registerPaymentsMembers(payslip.value.slug, selectedPaymentsBorrowers.value)
        .then(() => {
            dialogStore
                .show({
                    variant: "success",
                    title: "Registro exitoso",
                    description: "¡Se han registrado los pagos!",
                })
                .then(() => {
                    emits("update:payments-payslip");
                });
        })
        .catch(() => {
            dialogStore.show({
                variant: "error",
                title: "Ha ocurrido un error",
                description: "¡No se pudo completar el registro!",
            });
        });
    emits("update:loading", false);
}

const selectedAll = ref(false);
const selectedPaymentsBorrowers = computed(() => payslipGroupStore.getPaymentsMembersSelected);

function changeSelectedAll(e: Event) {
    payslipGroupStore.setSelectedAllPaymentsMembers(selectedAll.value);
}

watch(() => selectedPaymentsBorrowers.value.length, (value: number) => {
    if (value == 0) {
        selectedAll.value = false;
    } else if (value == addPayments.value.length) {
        selectedAll.value = true;
    } else {
        selectedAll.value = false;
    }
})

onBeforeMount(async () => {
    await fnGetAddPaymentsMember();
});

onBeforeUnmount(() => {
    emits("update:loading", false);
    payslipGroupStore.setAddPaymentsMembers([]);
});


</script>
<template>
    <div>
        <r-table :fields="fieldsAddPayment" :items="addPayments" hidden-footer shadow-none>
            <template #header(full_name)="{ data }">
                <r-checkbox v-model="selectedAll" id="selectedAll" variant="primary" name="selectedAll"
                    @change="changeSelectedAll" :label="data.name"></r-checkbox>
            </template>

            <template #cell(full_name)="{ data }">
                <r-checkbox v-model="data.isSelected" :id="`payments-${data.id_borrower}`" class="font-bold"
                    variant="primary" name="payments" :label="data.full_name">
                </r-checkbox>
            </template>
            <template #cell(amount_payment)="{ data }">
                <r-input v-model="data.amount_payment" type="text" class="text-right w-64" currency></r-input>
            </template>
            <template #label-empty> No hay pagos pendientes </template>
        </r-table>

        <div class="mt-6 flex justify-end">
            <r-spinner v-if="loadingSave" class="mr-3"></r-spinner>
            <r-btn :disabled="selectedPaymentsBorrowers.length == 0 || loadingSave" @click="fnSavePaymentsMembers">
                Guardar
            </r-btn>
        </div>
    </div>
</template>
