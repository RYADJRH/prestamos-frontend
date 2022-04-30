<script setup lang="ts">
import { computed, ref } from "vue";
import { useDebounceFn } from "@vueuse/core";

import { moneyMxn } from "@/utils/currency";

import { useDialogStore } from "@/stores/dialog.store";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import { Group } from "@/interfaces/group.interface";
import { BorrowerAmounts } from "@/interfaces/groupBorrower.interface";

import { SearchIcon, TrashIcon, PencilAltIcon } from "@heroicons/vue/solid";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import AddOrEditMemberGroup from "@/components/groups/members/addOrEdit.vue";

const dialogStore = useDialogStore();
const individualGroupStore = useIndividualGroupStore();

const group = computed(() => {
  return individualGroupStore.getGroup as Group;
});

const inputSearchMembers = ref("");
const inputSearchDebounce = useDebounceFn(
  async () => {
    await fnBorrowerGroup();
  },
  500,
  { maxWait: 1000 }
);

const currentPage = computed({
  get() {
    return individualGroupStore.getCurrentPageBorrower;
  },
  async set(page: number) {
    individualGroupStore.setPageBorrower(page);
    await fnBorrowerGroup();
  },
});

const totalPages = computed({
  get() {
    return individualGroupStore.getTotalPagesBorrower;
  },
  set(pages: number) {
    individualGroupStore.setTotalPageBorrower(pages);
  },
});

const fieldsMiembros = [
  { key: "full_name", name: "Nombre" },
  { key: "amount_borrow", name: "Prestado" },
  { key: "amount_interest", name: "Intereses" },
  { key: "amount_pay", name: "A pagar" },
  { key: "amount_payment_total", name: "Pagado" },
  { key: "acciones", name: "Acciones" },
];
const borrowers = computed(() => individualGroupStore.getBorrowersAmount);

async function fnBorrowerGroup() {
  await individualGroupStore
    .getApiBorrowersGroup(
      group.value.slug as string,
      currentPage.value,
      inputSearchMembers.value
    )
    .catch(() => {});
}

const modalAddUpdateMember = ref(false);
const modeEditBorrowerGroup = ref(false);
const selectedBorrower = ref<null | {
  id_group_borrower: number;
  id_borrower: number;
  full_name: string;
}>(null);
const amountsBorrower = ref<null | { amount_borrow: number; amount_interest: number }>(
  null
);

function addMemberOpenModal() {
  selectedBorrower.value = null;
  amountsBorrower.value = null;
  modeEditBorrowerGroup.value = false;
  modalAddUpdateMember.value = true;
}
function editMemberOpenModal(data: BorrowerAmounts) {
  const {
    id_group_borrower,
    id_borrower,
    full_name,
    amount_borrow,
    amount_interest,
  } = data;
  selectedBorrower.value = { id_group_borrower, id_borrower, full_name };
  amountsBorrower.value = { amount_borrow, amount_interest };
  modeEditBorrowerGroup.value = true;
  modalAddUpdateMember.value = true;
}

const loadingAddEditMember = ref(false);
function updateLoadingAddEditMember(value: boolean) {
  loadingAddEditMember.value = value;
}
function closeModal() {
  modalAddUpdateMember.value = false;
  updateLoadingAddEditMember(false);
}
async function fnApiGroup() {
  await individualGroupStore.getApiGroup(group.value.slug as string).catch(() => {});
}

function deleteMember(id_group_borrower: number) {
  dialogStore
    .show({
      confirm: true,
      variant: "question",
      title: "¿Deseas eliminar este miembro del grupo?",
      description: "¡Esta acción es irreversible!",
    })
    .then(async (result) => {
      if (result) {
        await individualGroupStore
          .deleteApiBorrowerGroup(id_group_borrower)
          .then((isDeleted) => {
            if (isDeleted) {
              fnApiGroup();
              dialogStore.show({
                variant: "success",
                title: "Elimanación exitosa",
                description: "¡El miembro ha sido eliminado!",
              });
              if (borrowers.value.length == 0 && totalPages.value > 1) {
                fnBorrowerGroup();
              }
            } else {
              dialogStore.show({
                variant: "error",
                title: "Ocurrio un error",
                description: "¡No se pudo eliminar el miembro!",
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
</script>
<template>
  <div>
    <h1 class="text-gray-600 text-lg">Miembros</h1>
    <div class="mt-4">
      <div class="flex flex-col md:flex-row justify-between">
        <div>
          <r-btn @click="addMemberOpenModal"> Agregar </r-btn>
        </div>
        <div class="block relative md:w-64 w-full mt-2 md:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
          </span>
          <r-input
            v-model="inputSearchMembers"
            class="pl-10"
            @input="inputSearchDebounce"
            type="search"
            placeholder="busqueda"
          ></r-input>
        </div>
      </div>
      <div class="mt-4">
        <r-table
          :fields="fieldsMiembros"
          :items="borrowers"
          :hidden-footer="borrowers.length == 0"
        >
          <template #cell(full_name)="{ data }">
            <span class="font-bold">{{ data.full_name }}</span>
          </template>
          <template #cell(amount_borrow)="{ data }">
            {{ moneyMxn(data.amount_borrow) }}
          </template>
          <template #cell(amount_interest)="{ data }">
            {{ moneyMxn(data.amount_interest) }}
          </template>
          <template #cell(amount_pay)="{ data }">
            {{ moneyMxn(data.amount_pay) }}
          </template>
          <template #cell(amount_payment_total)="{ data }">
            {{ moneyMxn(data.amount_payment_total) }}
          </template>
          <template #cell(acciones)="{ data }">
            <r-btn
              variant="danger"
              class="mr-3 px-1 py-2"
              @click="deleteMember(data.id_group_borrower)"
            >
              <TrashIcon class="h-5 w-5 text-white"></TrashIcon>
            </r-btn>
            <r-btn
              variant="success"
              class="mr-3 px-1 py-2"
              @click="editMemberOpenModal(data)"
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
      v-model="modalAddUpdateMember"
      :loading="loadingAddEditMember"
      :title="(modeEditBorrowerGroup ? 'Editar' : 'Agregar') + ' miembro'"
      hidden-footer
    >
      <template #content>
        <add-or-edit-member-group
          @close:modal="closeModal"
          @update:loading-save="updateLoadingAddEditMember"
          :loading-save="loadingAddEditMember"
          :slug-group="(group.slug as string)"
          :mode-edit="modeEditBorrowerGroup"
          :selected-borrower="selectedBorrower"
          :amounts-borrower="amountsBorrower"
        ></add-or-edit-member-group>
      </template>
    </r-modal>
  </div>
</template>
