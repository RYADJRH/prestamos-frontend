<script setup lang="ts">
import { ref, reactive, onBeforeMount, onBeforeUnmount, computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import {
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import { UseBorrowerStore } from "@/stores/borrower.store";
import { useAuthStore } from "@/stores/auth.store";
import { useErrorStore } from "@/stores/error.store";
import { useDialogStore } from "@/stores/dialog.store";

import RCheckbox from "@/components/shared_components/rComponents/RCheckbox.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInputFile from "@/components/shared_components/rComponents/RInputFile.vue";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";
import { Borrower, BorrrowerRequest } from "@/interfaces/borrower.interface";

const toast = useToast();
const borrowerStore = UseBorrowerStore();
const authStore = useAuthStore();
const errorStore = useErrorStore();
const dialogStore = useDialogStore();
/* new borrower */
const modeEdit = ref(false);
const loadingSave = ref(false);
const modalAddBorrower = ref(false);

const initStateNewBorrower: Borrower = {
  name_borrower: "",
  last_name_borrower: "",
  name_file_ine_borrower: null,
  name_file_proof_address_borrower: null,
  name_file_ine_borrower_path: null,
  name_file_proof_address_borrower_path: null,
  remove_file_ine_borrower: false,
  remove_file_proof_address_borrower: false,
  id_beneficiary: authStore.profileId as number,
};

const newBorrower = reactive({ ...initStateNewBorrower });

function saveBorrowerModal() {
  Object.assign(newBorrower, { ...initStateNewBorrower });
  errorStore.$reset();
  modeEdit.value = false;
  modalAddBorrower.value = true;
}

async function saveBorrower(target: HTMLFormElement) {
  loadingSave.value = true;
  await borrowerStore
    .saveBorrower(newBorrower)
    .then(() => {
      Object.assign(newBorrower, { ...initStateNewBorrower });
      target.reset();
      toast.success("¡El prestatista ha sido guardado!")
    })
    .catch((err) => {
      if (err.response.status !== 422) {
        toast.error("¡No se pudo completar el registro!")
      }
    });
  loadingSave.value = false;
}
/* searching */
const inputSearch = ref("");
const inputSearchDebounce = useDebounceFn(
  async () => {
    await fnGetBorrowers();
  },
  500,
  { maxWait: 1000 }
);

const currentPage = computed({
  get() {
    return borrowerStore.currentPage;
  },
  async set(page: number) {
    borrowerStore.setPage(page);
    await fnGetBorrowers();
  },
});

const totalPages = computed({
  get() {
    return borrowerStore.totalPages;
  },
  set(pages: number) {
    borrowerStore.setTotalPage(pages);
  },
});

const fields = reactive([
  { name: "Nombre", key: "name_borrower" },
  { name: "Apellidos", key: "last_name_borrower" },
  { name: "INE", key: "name_file_ine_borrower_path" },
  { name: "Comprobante de domicilio", key: "name_file_proof_address_borrower_path" },
  { name: "acciones", key: "acciones" },
]);

async function fnGetBorrowers() {
  await borrowerStore
    .listBorrowers(authStore.profileId as number, inputSearch.value)
    .catch(() => { });
}

function deleteBorrower(id_borrower: number) {
  dialogStore
    .show({
      variant: "question",
      title: "¿Deseas eliminar a este prestatario?",
      description: "¡La acción es irreversible!",
      confirm: true,
    })
    .then((result) => {
      if (result) {
        borrowerStore
          .deleteBorrower(id_borrower)
          .then(() => {
            toast.success("¡El registro se ha eliminado!")
          })
          .catch(() => {
            toast.error("¡No se pudo eliminar el registro!")
          });
      }
    });
}

const id_borrower = ref(-1);
function editBorrowerModal({ ...data }: BorrrowerRequest) {
  errorStore.$reset();
  modeEdit.value = true;
  modalAddBorrower.value = true;
  id_borrower.value = data.id_borrower;
  Object.assign(newBorrower, {
    name_borrower: data.name_borrower,
    last_name_borrower: data.last_name_borrower,
    name_file_ine_borrower: null,
    name_file_proof_address_borrower: null,
    name_file_ine_borrower_path: data.name_file_ine_borrower_path,
    name_file_proof_address_borrower_path: data.name_file_proof_address_borrower_path,
    remove_file_ine_borrower: false,
    remove_file_proof_address_borrower: false,
    id_beneficiary: data.id_beneficiary,
  });
}

async function editBorrower(target: HTMLFormElement) {
  loadingSave.value = true;
  await borrowerStore
    .updateBorrower(newBorrower, id_borrower.value)
    .then(() => {
      target.reset();
      modalAddBorrower.value = false;
      toast.success("¡El prestatista ha sido actualizado!")
    })
    .catch((err) => {
      if (err.response.status !== 422) {
        toast.error("¡No se pudo completar el registro!")
      }
    });

  loadingSave.value = false;
}

function submitForm(event: Event) {
  const target = event.target as HTMLFormElement;
  if (modeEdit.value) {
    editBorrower(target);
  } else {
    saveBorrower(target);
  }
}

watch(
  () => borrowerStore.getBorrowers.length,
  async (value) => {
    if (value == 0 && borrowerStore.totalPages > 1) {
      borrowerStore.setPage(1);
      await fnGetBorrowers();
    }
  }
);

onBeforeMount(async () => {
  errorStore.$reset();
  await fnGetBorrowers();
});

onBeforeUnmount(() => {
  borrowerStore.$reset();
});

</script>

<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-2xl flex text-gray-600 dark:text-white">Lista prestatarios</h1>
    <div class="md:flex md:justify-between">
      <div class="md:grid md:place-content-center">
        <r-btn variant="primary" @click="saveBorrowerModal">Agregar</r-btn>
      </div>
      <div class="relative md:w-64 w-full mt-2 md:mt-0">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <MagnifyingGlassIcon class="h-6 w-6 text-gray-500"></MagnifyingGlassIcon>
        </span>
        <r-input v-model="inputSearch" class="pl-10" type="search" placeholder="busqueda" @input="inputSearchDebounce">
        </r-input>
      </div>
    </div>
    <r-table :fields="fields" :items="borrowerStore.getBorrowers" :hidden-footer="borrowerStore.getBorrowers.length == 0">
      <template #cell(acciones)="{ data }">
        <r-btn variant="danger" class="mr-3" @click="deleteBorrower(data.id_borrower)">
          <TrashIcon class="h-4 w-4 text-white"></TrashIcon>
        </r-btn>
        <r-btn variant="success" class="mr-3" @click="editBorrowerModal(data)">
          <PencilSquareIcon class="h-4 w-4 text-white"></PencilSquareIcon>
        </r-btn>
      </template>
      <template #cell(name_file_ine_borrower_path)="{ data }">
        <a v-if="data.name_file_ine_borrower_path" class="cursor-pointer hover:text-sky-800"
          :href="data.name_file_ine_borrower_path" target="_blank">
          <DocumentTextIcon class="w-8 h-8"></DocumentTextIcon>
        </a>
        <span v-else>No disponible</span>
      </template>

      <template #cell(name_file_proof_address_borrower_path)="{ data }">
        <a v-if="data.name_file_proof_address_borrower_path" class="cursor-pointer hover:text-sky-800"
          :href="data.name_file_proof_address_borrower_path" target="_blank">
          <DocumentTextIcon class="w-8 h-8"></DocumentTextIcon>
        </a>
        <span v-else>No disponible</span>
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
  <r-modal v-model="modalAddBorrower" size="sm" :title="(modeEdit ? 'Editar' : 'Agregar') + ' prestatario'" hidden-footer
    :loading="loadingSave">
    <template #content>
      <form @submit.prevent="submitForm">
        <r-form-group title="Nombre:" class="mb-6">
          <r-input v-model="newBorrower.name_borrower" type="text" placeholder="Yaretzin" class="mt-2" :stateError="errorStore.errors && errorStore.errors.hasOwnProperty('name_borrower')
            " required></r-input>
          <r-error-input :errors="errorStore.errors" field="name_borrower"></r-error-input>
        </r-form-group>
        <r-form-group title="Apellidos:" class="mb-6">
          <r-input v-model="newBorrower.last_name_borrower" type="text" placeholder="Araujo Delgado" class="mt-2"
            :stateError="errorStore.errors && errorStore.errors.hasOwnProperty('last_name_borrower')
              " required></r-input>
          <r-error-input :errors="errorStore.errors" field="last_name_borrower"></r-error-input>
        </r-form-group>
        <div class="mb-6">
          <r-form-group title="INE:">
            <r-input-file v-model="newBorrower.name_file_ine_borrower" class="mt-2"
              accept=".pdf, .png, .jpg" :stateError="errorStore.errors &&
                errorStore.errors.hasOwnProperty('name_file_ine_borrower')
                " :disabled="newBorrower.remove_file_ine_borrower"></r-input-file>
            <r-error-input :errors="errorStore.errors" field="name_file_ine_borrower"></r-error-input>
          </r-form-group>
          <r-checkbox v-if="newBorrower.name_file_ine_borrower_path"
            v-model="(newBorrower.remove_file_ine_borrower as boolean)" id="checkbox_remove_ine"
            name="checkbox_remove_ine" variant="danger" class="mt-2" label="Eliminar el archivo cargado anteriormente">
          </r-checkbox>
        </div>
        <div class="mb-6">
          <r-form-group title="Comprobante de domicilio:">
            <r-input-file v-model="newBorrower.name_file_proof_address_borrower" class="mt-2" accept=".pdf, .png, .jpg"
              :stateError="errorStore.errors &&
                errorStore.errors.hasOwnProperty('name_file_proof_address_borrower')
                " :disabled="newBorrower.remove_file_proof_address_borrower"></r-input-file>
            <r-error-input :errors="errorStore.errors" field="name_file_proof_address_borrower"></r-error-input>
          </r-form-group>
          <r-checkbox v-if="newBorrower.name_file_proof_address_borrower_path"
            v-model="(newBorrower.remove_file_proof_address_borrower as boolean)" id="checkbox_remove_proof_address"
            name="checkbox_remove_proof_address" variant="danger" class="mt-2"
            label="Eliminar el archivo cargado anteriormente"></r-checkbox>
        </div>
        <div class="flex justify-end">
          <r-btn :disabled="loadingSave" class="flex items-center justify-center">
            <r-spinner v-if="loadingSave" class="mr-3" size="btn"></r-spinner>guardar
          </r-btn>
        </div>
      </form>
    </template>
  </r-modal>
</template>
