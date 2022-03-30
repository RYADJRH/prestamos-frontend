<script setup lang="ts">
import { ref, reactive } from "vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue"
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RInputFile from "@/components/shared_components/rComponents/RInputFile.vue";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import { TrashIcon, PencilAltIcon, SearchIcon } from "@heroicons/vue/solid";

const input = ref("");
const currentPage = ref(1);
const totalPages = ref(100);

/* new borrower */
const loadingSave = ref(false);
const modalAddBorrower = ref(false);
const initStateNewBorrower = {
  name_borrower: '',
  last_name_borrower: '',
  name_file_ine: null,
  name_file_proof_addres: null,
};
const newBorrower = reactive({ ...initStateNewBorrower });

function saveBorrower(event: Event): void {
  const target = event.target as HTMLFormElement;
  Object.assign(newBorrower, { ...initStateNewBorrower })
  target.reset();
}

const fields = ref([
  { name: 'Nombre', key: 'nombre' },
  { name: 'Apellidos', key: 'apellidos' },
  { name: 'INE', key: 'ine' },
  { name: 'Comprobante de domicilio', key: 'comprobante' },
  { name: 'acciones', key: 'acciones' },
]);

const items = ref(
  [
    { nombre: "nombre1", apellidos: "apellidos1", ine: "ine1", comprobante: "comprobante1" },
    { nombre: "nombre2", apellidos: "apellidos2", ine: "ine2", comprobante: "comprobante2" },
    { nombre: "nombre3", apellidos: "apellidos3", ine: "ine3", comprobante: "comprobante3" },
  ]
);



</script>
<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-2xl flex">Lista prestatarios</h1>
    <div class="flex justify-between">
      <div class="grid place-content-center">
        <r-btn variant="primary" @click="modalAddBorrower = true">Agregar</r-btn>
      </div>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
        </span>
        <r-input v-model="input" class="pl-10" type="search" placeholder="busqueda"></r-input>
      </div>
    </div>
    <r-table :fields="fields" :items="items">
      <template #cell(acciones)="{ data }">
        <r-btn variant="danger" class="mr-3 px-1 py-2">
          <TrashIcon class="h-6 w-6 text-white"></TrashIcon>
        </r-btn>
        <r-btn variant="success" class="mr-3 px-1 py-2">
          <PencilAltIcon class="h-6 w-6 text-white"></PencilAltIcon>
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

    <r-modal
      v-model="modalAddBorrower"
      size="md"
      title="Agregar prestatario"
      hidden-footer
      :loading="loadingSave"
    >
      <template #content>
        <form @submit.prevent="saveBorrower">
          <r-form-group title="Nombre:" class="mb-6">
            <r-input
              v-model="newBorrower.name_borrower"
              type="text"
              placeholder="Yaretzin"
              class="mt-2"
              required
            ></r-input>
          </r-form-group>
          <r-form-group title="Apellidos:" class="mb-6">
            <r-input
              v-model="newBorrower.last_name_borrower"
              type="text"
              placeholder="Araujo Delgado"
              class="mt-2"
              required
            ></r-input>
          </r-form-group>
          <r-form-group title="INE:" class="mb-6">
            <r-input-file
              v-model="newBorrower.name_file_ine"
              class="mt-2"
              accept=".pdf, .png, .jpg"
            ></r-input-file>
          </r-form-group>
          <r-form-group title="Comprobante de domicilio:" class="mb-6">
            <r-input-file
              v-model="newBorrower.name_file_proof_addres"
              class="mt-2"
              accept=".pdf, .png, .jpg"
            ></r-input-file>
          </r-form-group>

          <div class="flex justify-end">
            <r-btn :disabled="loadingSave">
              <r-spinner v-if="loadingSave" class="mr-3"></r-spinner>guardar
            </r-btn>
          </div>
        </form>
      </template>
    </r-modal>
  </div>
</template>
