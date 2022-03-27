<script setup lang="ts">
import { ref } from "vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue"
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import { TrashIcon, PencilAltIcon } from "@heroicons/vue/solid";

const input = ref("");
const currentPage = ref(1);
const totalPages = ref(100);

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
    <div class="h-14 px-4 bg-white shadow rounded-md flex items-center justify-between">
      <h5 class="text-gray-600">Busqueda</h5>
      <r-input v-model="input" type="text" class="w-56" placeholder="Rebolledo"></r-input>
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
  </div>
</template>
