<script setup lang="ts">
import { ref, onBeforeMount, inject, onBeforeUnmount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import {
  CalendarIcon,
  ArchiveIcon,
  UserGroupIcon,
  CogIcon,
  CurrencyDollarIcon,
  ArrowSmLeftIcon,
  SearchIcon,
} from "@heroicons/vue/solid";

import { formatDate } from "@/utils/dates";
import { moneyMxn } from "@/utils/currency";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import AddOrEditMemberGroup from "@/components/groups/members/addOrEdit.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import RMenu from "@/components/shared_components/rComponents/RMenu.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import { Group } from "@/interfaces/group.interface";

const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const individualGroupStore = useIndividualGroupStore();
const router = useRouter();
const route = useRoute();
const settingsMenu = ref(false);
const settingsGroup = ref(null);

onClickOutside(settingsGroup, (event) => {
  settingsMenu.value = false;
});

const group = computed(() => {
  return individualGroupStore.getGroup as Group;
});

const amounts = computed(() => {
  return individualGroupStore.getAmountsGroup;
});

const inputSearchMembers = ref("");
const fieldsMiembros = [
  { key: "name_borrower", name: "Nombre" },
  { key: "borrowed", name: "Prestado" },
  { key: "interest", name: "Intereses" },
  { key: "to_pay", name: "A pagar" },
  { key: "acciones", name: "Acciones" },
];

const modalAddUpdateMember = ref(false);
const modeEditBorrowerGroup = ref(false);

function addMemberOpenModal() {
  modeEditBorrowerGroup.value = false;
  modalAddUpdateMember.value = true;
}

const slug = ref("");
onBeforeMount(async () => {
  setLoadingFull(true);
  slug.value = route.params.slug as string;
  await individualGroupStore.getApiGroup(slug.value).catch(() => {});
  setLoadingFull(false);
});

onBeforeUnmount(() => {
  individualGroupStore.$reset();
  setLoadingFull(false);
});
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <a
          class="text-gray-600 hover:text-red-800 cursor-pointer"
          @click="router.push('/grupos')"
        >
          <ArrowSmLeftIcon class="w-8 h-8"></ArrowSmLeftIcon>
        </a>
        <h1 class="text-2xl text-gray-600">{{ group.name_group }}</h1>
      </div>
      <div class="relative" ref="settingsGroup">
        <r-btn variant="danger" @click="settingsMenu = !settingsMenu">
          <CogIcon class="h-4 w-4"></CogIcon>
        </r-btn>
        <r-menu v-model="settingsMenu" align="bottom-right">
          <template #list>
            <li>
              <button
                class="w-full flex gap-1 p-2 text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 rounded-md"
              >
                <ArchiveIcon class="h-6 w-6"></ArchiveIcon>
                {{ group.state_archived_group ? "Proces" : "Archivar" }}
              </button>
            </li>
          </template>
        </r-menu>
      </div>
    </div>

    <div class="flex flex-wrap bg-white rounded-md p-4 mt-4 shadow-sm text-gray-600">
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CalendarIcon class="h-6 w-6"></CalendarIcon>
        Fecha : <strong>{{ formatDate(group.created_group, "LL") }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CalendarIcon class="h-6 w-6"></CalendarIcon>
        Dia de pago :<strong>{{ group.day_payment_name }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <ArchiveIcon class="h-6 w-6"></ArchiveIcon>
        Status :
        <strong> {{ group.state_archived_group ? "Archivado" : "En proceso" }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <UserGroupIcon class="h-6 w-6"></UserGroupIcon>
        No.miembros :<strong>{{ amounts.number_members }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
        Prestado :<strong>{{ moneyMxn(amounts.amount_borrow) }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
        Intereses :<strong>{{ moneyMxn(amounts.amount_interest) }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
        Cobrado :<strong>{{ moneyMxn(amounts.amount_charged) }}</strong>
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
        Total :<strong>{{ moneyMxn(amounts.amount_total) }}</strong>
      </div>
    </div>
    <div class="my-4">
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
            <!--@input="inputSearchDebounce" -->
            <r-input
              v-model="inputSearchMembers"
              class="pl-10"
              type="search"
              placeholder="busqueda"
            ></r-input>
          </div>
        </div>
        <div class="mt-4">
          <r-table :fields="fieldsMiembros" :items="[]" hidden-footer></r-table>
        </div>
      </div>
    </div>
  </div>
  <r-modal
    v-model="modalAddUpdateMember"
    :title="(modeEditBorrowerGroup ? 'Editar' : 'Agregar') + ' miembro'"
    hidden-footer
  >
    <template #content>
      <add-or-edit-member-group
        :slug-group="slug"
        :mode-edit="modeEditBorrowerGroup"
        :selected-borrower="null"
        :amounts-borrower="null"
      ></add-or-edit-member-group>
    </template>
  </r-modal>
</template>
