
<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import RTable from '@/components/shared_components/rComponents/RTable.vue';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import { usePayslipGroupStore } from "@/stores/payslipGroup.store";
import { useDialogStore } from "@/stores/dialog.store";

const payslipGroupStore = usePayslipGroupStore();
const dialogStore = useDialogStore();

const payslip = computed(() => payslipGroupStore.getPayslip);

const emits = defineEmits<
    {
        (e: 'update:loading', value: boolean): void,
        (e: 'update:payments-payslip'): void
    }
>();

const fieldsAddPayment = [
    { key: 'full_name', name: 'Nombre' },
    { key: 'amount_payment', name: 'Total a abonar' },
];

const addPayments = computed(() => payslipGroupStore.getAddPaymentsMembers);

async function fnGetAddPaymentsMember() {
    await payslipGroupStore.getaddPaymentsMemberPayslip(payslip.value.slug).catch(() => { });
}

async function fnSavePaymentsMembers() {
    emits('update:loading', true);
    await payslipGroupStore.registerPaymentsMembers(payslip.value.slug, addPayments.value)
        .then(() => {
            dialogStore.show({
                variant: "success",
                title: "Registro exitoso",
                description: "¡Se han registrado los pagos!",
            })
                .then(() => {
                    emits('update:payments-payslip');
                })
        })
        .catch(() => {
            dialogStore.show({
                variant: "error",
                title: "Ha ocurrido un error",
                description: "¡No se pudo completar el registro!",
            });
        });
    emits('update:loading', false);

}

onBeforeMount(async () => {
    await fnGetAddPaymentsMember();
})

onBeforeUnmount(() => {
    emits('update:loading', false);
    payslipGroupStore.setAddPaymentsMembers([]);

})

</script>
<template>
    <div>
        <r-table :fields="fieldsAddPayment" :items="addPayments" hidden-footer shadow-none>
            <template #cell(full_name)="{ data }">
                <span class="font-bold">
                    {{ data.full_name }}
                </span>
            </template>
            <template #cell(amount_payment)="{ data }">
                <r-input v-model="data.amount_payment" type="text" class="text-right w-64" currency></r-input>
            </template>
            <template #label-empty>
                No hay pagos pendientes
            </template>
        </r-table>

        <div class="mt-6 flex justify-end">
            <r-btn :disabled="addPayments.length == 0" @click="fnSavePaymentsMembers">Guardar</r-btn>
        </div>
    </div>
</template>
