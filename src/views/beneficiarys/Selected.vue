<script setup lang="ts">
import { ref, onBeforeMount, watch, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useBeneficiaryStore } from "@/stores/beneficiary.store";
import { useErrorStore } from "@/stores/error.store";
import { useDialogStore } from "@/stores/dialog.store";
import { Beneficiary } from "@/interfaces/beneficiary.interface";
import CardUser from "@/components/beneficiarys/CardUser.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";

const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const modeEdit = ref(false);
const beneficiaryEditId = ref<number>(-1);
/* beneficiary store */
const router = useRouter();
const authStore = useAuthStore();
const beneficiaryStore = useBeneficiaryStore();
const errorStore = useErrorStore();
const dialogStore = useDialogStore();
/* modal */
const modalBeneficiary = ref(false);
const name_beneficiary = ref("");
const loadingSaveUpdateBeneficiary = ref(false);

async function saveUpdateBeneficiary() {
  loadingSaveUpdateBeneficiary.value = true;
  if (modeEdit.value) {
    await beneficiaryStore
      .updateBeneficiary(beneficiaryEditId.value, name_beneficiary.value)
      .then(() => {
        modalBeneficiary.value = false;
      })
      .catch(() => {});
  } else {
    await beneficiaryStore
      .registerBeneficiary(name_beneficiary.value)
      .then(() => {
        modalBeneficiary.value = false;
      })
      .catch(() => {});
  }
  loadingSaveUpdateBeneficiary.value = false;
}

function deleteBeneficiary() {
  if (modeEdit.value) {
    dialogStore
      .show({
        variant: "question",
        title: "¿Desea eliminar a este beneficiario?",
        description: "¡Esta acción es irreversible!",
        confirm: true,
      })
      .then(async (result) => {
        if (result) {
          setLoadingFull(true);
          await beneficiaryStore
            .deleteBeneficiary(beneficiaryEditId.value)
            .finally(() => {
              if (beneficiarys.value.length == 0) modeEdit.value = false;
              authStore.profileBeneficiary = null;
              modalBeneficiary.value = false;
              setLoadingFull(false);
            });
        }
      });
  }
}

function selectedBeneficiary(beneficiary: Beneficiary) {
  if (modeEdit.value) {
    beneficiaryEditId.value = beneficiary.id_beneficiary;
    name_beneficiary.value = beneficiary.name_beneficiary;
    modalBeneficiary.value = true;
  } else {
    authStore.setProfileBeneficiary(beneficiary);
    router.replace({ name: "home" });
  }
}

onBeforeMount(async () => {
  await beneficiaryStore.getBeneficiary();
});

const beneficiarys = computed(() => {
  return beneficiaryStore.getBeneficiarys;
});

watch(modalBeneficiary, (value) => {
  if (!value) {
    beneficiaryEditId.value = -1;
    name_beneficiary.value = "";
    errorStore.$reset();
  }
});
</script>
<template>
  <div class="lg:h-screen flex flex-col justify-center items-center py-4 lg:py-0">
    <h1 class="text-4xl text-center mb-5 text-white">Selecciona un beneficiario</h1>
    <div class="w-2/3 flex flex-wrap justify-center">
      <div
        class="w-full md:w-1/2 lg:w-1/5"
        v-for="beneficiary in beneficiarys"
        :key="beneficiary.id_beneficiary"
      >
        <card-user
          :mode-edit="modeEdit"
          :beneficiary="beneficiary"
          @click="selectedBeneficiary(beneficiary)"
        ></card-user>
      </div>

      <div class="w-full md:w-1/2 lg:w-1/5" v-if="beneficiarys.length < 5 && !modeEdit">
        <card-user
          add
          :beneficiary="{
            id_beneficiary: -1,
            name_beneficiary: 'Agregar',
            name_acronym: '+',
            id_user: -1,
          }"
          @click="modalBeneficiary = true"
        ></card-user>
      </div>
    </div>
    <div class="mt-6" v-if="beneficiarys.length > 0">
      <r-btn variant="outline-light" @click="modeEdit = !modeEdit">
        {{ modeEdit ? "Listo" : "Editar perfiles" }}
      </r-btn>
    </div>
  </div>
  <div>
    <r-modal
      v-model="modalBeneficiary"
      size="md"
      :title="(modeEdit ? 'Editar' : 'Agregar') + ' beneficiario'"
      :loading="loadingSaveUpdateBeneficiary"
    >
      <template #content>
        <r-form-group title="Nombre del beneficiario:">
          <r-input
            v-model="name_beneficiary"
            type="text"
            placeholder="Rafael De Jesus Rebolledo Hernandez"
            class="mt-2"
            :state-error="
              errorStore.errors && errorStore.errors.hasOwnProperty('name_beneficiary')
            "
          ></r-input>
          <r-error-input
            :errors="errorStore.errors"
            field="name_beneficiary"
          ></r-error-input>
        </r-form-group>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <r-btn
            type="button"
            variant="danger"
            class="mr-3"
            v-if="modeEdit"
            @click="deleteBeneficiary"
          >
            Eliminar
          </r-btn>
          <r-btn
            type="button"
            @click="saveUpdateBeneficiary"
            :disabled="loadingSaveUpdateBeneficiary"
          >
            <r-spinner class="mr-2" v-if="loadingSaveUpdateBeneficiary" size="btn"></r-spinner>
            Guardar
          </r-btn>
        </div>
      </template>
    </r-modal>
  </div>
</template>
