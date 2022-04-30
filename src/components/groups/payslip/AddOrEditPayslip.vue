<script setup lang="ts">
import { Payslip } from "@/interfaces/payslipGroup.interface";
import { reactive, onBeforeMount, onBeforeUnmount } from "vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";

import { usePayslipGroupStore } from "@/stores/payslipGroup.store";
import { useErrorStore } from "@/stores/error.store";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import { useDialogStore } from "@/stores/dialog.store";
const dialogStore = useDialogStore();

const errorStore = useErrorStore();
const individualGroupStore = useIndividualGroupStore();
const payslipGroupStore = usePayslipGroupStore();

onBeforeMount(() => {
  errorStore.$reset();
});

onBeforeUnmount(() => {
  dialogStore.$reset();
  payslipGroupStore.$reset();
});

const emits = defineEmits<{
  (e: "close:modal"): void;
  (e: "update:loadingSave", value: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    loadingSave?: boolean;
    slugGroup: string;
    modeEdit: boolean;
    selectedPayslip: Payslip | null;
  }>(),
  {
    loadingSave: false,
  }
);

const initSelectedPayslip: Payslip = {
  id_payslip: props.selectedPayslip?.id_payslip ?? -1,
  name_payslip: props.selectedPayslip?.name_payslip ?? "",
  created_payslip: props.selectedPayslip?.created_payslip ?? "",
  slug: "",
};

const payslip = reactive({ ...initSelectedPayslip });

async function savePayslip() {
  emits("update:loadingSave", true);
  if (props.modeEdit) {
    await payslipGroupStore
      .updatePaySlip(payslip)
      .then((payslipResponse) => {
        individualGroupStore.setUpdatePayslip(payslipResponse);
        dialogStore.show({
          variant: "success",
          title: "Actualización exitosa",
          description: "¡La hoja de pago ha sido actualizada!",
        });
      })
      .catch((err) => {
        if (err.response.status != 422) {
          dialogStore.show({
            variant: "error",
            title: "Ha ocurrido un error",
            description: "¡No se pudo completar el registro!",
          });
        }
      });
  } else {
    const { name_payslip, created_payslip } = payslip;
    await payslipGroupStore
      .addPaySlip({ slug_group: props.slugGroup, name_payslip, created_payslip })
      .then((payslipResponse) => {
        individualGroupStore.setPayslip(payslipResponse);
        dialogStore
          .show({
            variant: "success",
            title: "Registro exitoso",
            description: "¡La hoja de pago ha sido registrada!",
          })
          .then(() => {
            Object.assign(payslip, { ...initSelectedPayslip });
          });
      })
      .catch((err) => {
        if (err.response.status != 422) {
          dialogStore.show({
            variant: "error",
            title: "Ha ocurrido un error",
            description: "¡No se pudo completar el registro!",
          });
        }
      });
  }
  emits("update:loadingSave", false);
}
</script>
<template>
  <form @submit.prevent="savePayslip">
    <r-form-group title="Nombre de la hoja:" class="mb-3">
      <r-input
        v-model="payslip.name_payslip"
        type="text"
        placeholder="Hoja 1"
        :stateError="
          errorStore.errors && errorStore.errors.hasOwnProperty('name_payslip')
        "
      ></r-input>
      <r-error-input :errors="errorStore.errors" field="name_payslip"></r-error-input>
    </r-form-group>

    <r-form-group title="Fecha de creación:" class="mb-3">
      <r-input
        v-model="payslip.created_payslip"
        type="date"
        :stateError="
          errorStore.errors && errorStore.errors.hasOwnProperty('created_payslip')
        "
      ></r-input>
      <r-error-input :errors="errorStore.errors" field="created_payslip"></r-error-input>
    </r-form-group>

    <div class="flex justify-end">
      <r-btn type="submit" :disabled="loadingSave">
        <r-spinner class="mr-2" v-if="loadingSave"></r-spinner>
        Guardar
      </r-btn>
    </div>
  </form>
</template>
