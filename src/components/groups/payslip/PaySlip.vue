<script lang="ts" setup>
import { computed, ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { SearchIcon, PencilAltIcon, TrashIcon } from "@heroicons/vue/solid";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import { useDialogStore } from "@/stores/dialog.store";

import { formatDate } from "@/utils/dates";
import { Payslip } from "@/interfaces/payslipGroup.interface";
import { Group } from "@/interfaces/group.interface";

import AddOrEditPayslip from "@/components/groups/payslip/AddOrEditPayslip.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";

const individualGroupStore = useIndividualGroupStore();
const dialogStore = useDialogStore();

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

const selectedPayslip = ref<null | Payslip>(null);
const modalAddEditPayslip = ref(false);
const loadingAddEditPayslip = ref(false);
const modeEditPayslip = ref(false);

function closeModal() {
  modalAddEditPayslip.value = false;
}
function updateLoadingAddEditMember(value: boolean) {
  loadingAddEditPayslip.value = value;
}
function editPayslipModal(payslip: Payslip) {
  let { id_payslip, name_payslip, created_payslip, slug } = payslip;
  created_payslip = formatDate(created_payslip, "YYYY-MM-DD");

  selectedPayslip.value = { id_payslip, name_payslip, created_payslip, slug };
  modeEditPayslip.value = true;
  modalAddEditPayslip.value = true;
}
function addPayslipModal() {
  selectedPayslip.value = null;
  modeEditPayslip.value = false;
  modalAddEditPayslip.value = true;
}

function deletePayslip(id_payslip: number) {
  dialogStore
    .show({
      confirm: true,
      variant: "question",
      title: "¿Deseas eliminar esta hoja de pagos?",
      description: "¡Esta acción es irreversible!",
    })
    .then(async (result) => {
      if (result) {
        await individualGroupStore
          .deletePayslipGroup(id_payslip)
          .then((isDeleted) => {
            if (isDeleted) {
              fnApiGroup();
              fnBorrowerGroup();
              dialogStore.show({
                variant: "success",
                title: "Elimanación exitosa",
                description: "¡La hoja de pago ha sido eliminada!",
              });
              if (payslips.value.length == 0 && totalPages.value > 1) {
                fnPayslipsGroup();
              }
            } else {
              dialogStore.show({
                variant: "error",
                title: "Ocurrio un error",
                description: "¡No se pudo eliminar la hoja de pago!",
              });
            }
          })
          .catch(() => {
            dialogStore.show({
              variant: "error",
              title: "Ha ocurrido un error",
              description: "¡No se pudo completar el registro!",
            });
          });
      }
    });
}
async function fnApiGroup() {
  await individualGroupStore.getApiGroup(group.value.slug as string).catch(() => {});
}

async function fnBorrowerGroup() {
  await individualGroupStore
    .getApiBorrowersGroup(group.value.slug as string, 1, "")
    .catch(() => {});
}
</script>

<template>
  <div>
    <h1 class="text-gray-600 text-lg">Hojas de pago</h1>
    <div class="mt-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div>
          <r-btn @click="addPayslipModal"> Crear hoja </r-btn>
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
            <router-link
              :to="`/hoja-pagos/${data.slug}`"
              class="font-bold hover:underline hover:underline-offset-4 hover:cursor-pointer"
            >
              {{ data.name_payslip }}
            </router-link>
          </template>
          <template #cell(created_payslip)="{ data }">
            {{ formatDate(data.created_payslip, "LL") }}
          </template>
          <template #cell(acciones)="{ data }">
            <r-btn
              variant="danger"
              class="mr-3 px-1 py-2"
              @click="deletePayslip(data.id_payslip)"
            >
              <TrashIcon class="h-5 w-5 text-white"></TrashIcon>
            </r-btn>

            <r-btn
              variant="success"
              class="mr-3 px-1 py-2"
              @click="editPayslipModal(data)"
            >
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

    <r-modal
      v-model="modalAddEditPayslip"
      :loading="loadingAddEditPayslip"
      :title="(modeEditPayslip ? 'Editar' : 'Agregar') + ' hoja de pago'"
      hidden-footer
    >
      <template #content>
        <add-or-edit-payslip
          @close:modal="closeModal"
          @update:loading-save="updateLoadingAddEditMember"
          :loading-save="loadingAddEditPayslip"
          :slug-group="(group.slug as string)"
          :mode-edit="modeEditPayslip"
          :selected-payslip="selectedPayslip"
        >
        </add-or-edit-payslip>
      </template>
    </r-modal>
  </div>
</template>
