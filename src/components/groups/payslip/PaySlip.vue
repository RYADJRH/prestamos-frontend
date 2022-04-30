<script lang="ts" setup>
import { computed, ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { SearchIcon, PencilAltIcon, TrashIcon } from "@heroicons/vue/solid";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";

import { formatDate } from "@/utils/dates";
import { Payslip } from "@/interfaces/payslipGroup.interface";
import { Group } from "@/interfaces/group.interface";

import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";

const individualGroupStore = useIndividualGroupStore();

const group = computed(() => {
  return individualGroupStore.getGroup as Group;
});

const fieldPayslip = [
  { key: "name_payslip", name: "Nombre de la hoja" },
  { key: "created_payslip", name: "Fecha de creación" },
  { key: "acciones", name: "Acciones" },
];

const payslips = computed(() => individualGroupStore.getPayslips);

const inputSearchPayslips = ref("");
const inputSearchDebounce = useDebounceFn(
  async () => {
    await fnPayslipsGroup();
  },
  500,
  { maxWait: 1000 }
);

const currentPage = computed({
  get() {
    return individualGroupStore.getCurrentPagePaylips;
  },
  async set(page: number) {
    individualGroupStore.setPagePayslips(page);
    await fnPayslipsGroup();
  },
});

const totalPages = computed({
  get() {
    return individualGroupStore.getTotalPagesPaylips;
  },
  set(pages: number) {
    individualGroupStore.setTotalPagePayslips(pages);
  },
});

async function fnPayslipsGroup() {
  await individualGroupStore
    .getApiPayslip(
      group.value.slug as string,
      currentPage.value,
      inputSearchPayslips.value
    )
    .catch(() => {});
}
</script>

<template>
  <div>
    <h1 class="text-gray-600 text-lg">Hojas de pago</h1>
    <div class="mt-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div>
          <!-- @click="addMemberOpenModal" -->
          <r-btn> Crear hoja </r-btn>
        </div>
        <div class="block relative md:w-64 w-full mt-2 md:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
          </span>

          <r-input
            v-model="inputSearchPayslips"
            @input="inputSearchDebounce"
            class="pl-10"
            type="search"
            placeholder="busqueda"
          ></r-input>
        </div>
      </div>
      <div class="mt-4">
        <r-table
          :fields="fieldPayslip"
          :items="payslips"
          :hidden-footer="payslips.length == 0"
        >
          <template #cell(name_payslip)="{ data }">
            <span class="font-bold hover:underline hover:underline-offset-4 hover:cursor-pointer">{{ data.name_payslip }}</span>
          </template>
          <template #cell(created_payslip)="{ data }">
            {{ formatDate(data.created_group, "LL") }}
          </template>
          <template #cell(acciones)="{ data }">
            <!-- @click="deleteMember(data.id_group_borrower)" -->
            <r-btn variant="danger" class="mr-3 px-1 py-2">
              <TrashIcon class="h-5 w-5 text-white"></TrashIcon>
            </r-btn>
            <!-- @click="editMemberOpenModal(data)" -->
            <r-btn variant="success" class="mr-3 px-1 py-2">
              <PencilAltIcon class="h-5 w-5 text-white"></PencilAltIcon>
            </r-btn>
          </template>
          <template #footer>
            <div class="flex justify-end items-center h-full">
              <div>
                <r-pagination
                  v-model="currentPage"
                  :total-pages="totalPages"
                  variant="dark"
                ></r-pagination>
              </div>
            </div>
          </template>
        </r-table>
      </div>
    </div>
  </div>
</template>
