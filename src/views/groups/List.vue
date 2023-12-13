<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  computed,
  watch,
  onBeforeUnmount,
  reactive,
  inject,
} from "vue";
import { useToast } from "vue-toastification";

import { useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { useGroupStore } from "@/stores/group.store";
import { useAuthStore } from "@/stores/auth.store";
import { useErrorStore } from "@/stores/error.store";
import { useDialogStore } from "@/stores/dialog.store";
import { SearchIcon } from "@heroicons/vue/solid";

import { Group } from "@/interfaces/group.interface";
import { DayWeek, DaysNames } from "@/interfaces/utils/DayWeek.interface";

import { formatDate } from "@/utils/dates";
import RBtnRadio from "@/components/shared_components/rComponents/RBtnRadio.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RSelect from "@/components/shared_components/rComponents/RSelect.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";
import CardGroup from "@/components/groups/CardGroup.vue";
const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const toast = useToast();
const router = useRouter();
const groupStore = useGroupStore();
const authStore = useAuthStore();
const errorStore = useErrorStore();
const dialogStore = useDialogStore();

const selectFiltroArchivo = computed({
  get() {
    return groupStore.seletecFilter;
  },
  set(value: 0 | 1) {
    groupStore.setSeletecFilter(value);
  },
});

const currentPage = computed({
  get() {
    return groupStore.currentPage;
  },
  set(value: number) {
    groupStore.setPage(value);
    fnListGroup();
  },
});

const totalPages = computed({
  get() {
    return groupStore.totalPages;
  },
  set(value: number) {
    groupStore.setTotalPage(value);
  },
});

const inputSearch = ref("");
const inputSearchDebounce = useDebounceFn(
  async () => {
    await fnListGroup();
  },
  500,
  { maxWait: 1000 }
);

async function fnListGroup() {
  await groupStore
    .getListGroups(authStore.profileId, inputSearch.value, selectFiltroArchivo.value)
    .catch(() => { });
}

function deleteGroup(id_group: number) {
  dialogStore
    .show({
      variant: "question",
      title: "¿Estas seguro de eliminar este grupo?",
      description: "Esta accion es irreversible",
      confirm: true,
    })
    .then(async (result) => {
      if (result) {
        setLoadingFull(true);
        groupStore
          .deleteGroup(id_group)
          .then(() => {
            toast.success("¡El grupo ha sido eliminado!");
          })
          .catch(() => {
            toast.error("¡No se pudo completar el registro!");
          });
        setLoadingFull(false);
      }
    });
}

function openModalEditGroup({ ...group }: Group) {
  group.created_group = formatDate(group.created_group, "YYYY-MM-DD");
  Object.assign(newGroup, group);
  errorStore.$reset();
  modeEdit.value = true;
  modalAddEditGroup.value = true;
}

watch(selectFiltroArchivo, async () => {
  groupStore.setPage(1);
  await fnListGroup();
});

watch(
  () => groupStore.getGroups.length,
  async (value) => {
    if (value == 0 && groupStore.totalPages > 1) {
      groupStore.setPage(1);
      await fnListGroup();
    }
  }
);

const loading = ref(false);

const initGroup: Group = {
  id_group: -1,
  name_group: "",
  created_group: "",
  day_payment: DayWeek["Lunes"],
  id_beneficiary: authStore.profileId as number,
};

const daysWeek = Object.values(DayWeek).filter(
  (key) => !isNaN(DayWeek[key as DaysNames])
) as DaysNames[];

const newGroup = reactive({ ...initGroup });
const modalAddEditGroup = ref(false);
const modeEdit = ref(false);

function openNewGroupModal() {
  Object.assign(newGroup, { ...initGroup });
  errorStore.$reset();
  modeEdit.value = false;
  modalAddEditGroup.value = true;
}

async function sendFormGroup(event: Event) {
  loading.value = true;
  if (modeEdit.value) {
    await groupStore
      .editGroup(newGroup)
      .then(() => {
        modalAddEditGroup.value = false;
        toast.success("¡El grupo ha sido actualizado!");
      })
      .catch((err) => {
        if (err.response.status !== 422) {
          toast.error("¡No se pudo completar la actualización!");
        }
      });
  } else {
    await groupStore
      .saveGroup(newGroup)
      .then(() => {
        Object.assign(newGroup, { ...initGroup });
        toast.success("¡El grupo ha sido guardado!");
      })
      .catch((err) => {
        if (err.response.status !== 422) {
          toast.error("¡No se pudo completar el registro!");
        }
      });
  }
  loading.value = false;
}

function selectedGroup(slug: string) {
  router.push(`/grupo/${slug}`);
}
onBeforeMount(async () => {
  errorStore.$reset();
  await fnListGroup();
});

onBeforeUnmount(() => {
  groupStore.$reset();
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl text-gray-600 dark:text-white">Lista de grupos</h1>
    <div class="md:flex md:justify-between">
      <div class="flex items-end">
        <div class="block">
          <r-btn variant="primary" @click="openNewGroupModal">Agregar</r-btn>
        </div>
      </div>

      <div class="md:flex block">
        <div class="flex items-end">
          <div class="block relative md:mr-3 md:w-64 w-full mt-2 md:mt-0">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
            </span>
            <r-input v-model="inputSearch" @input="inputSearchDebounce" class="pl-10" type="search"
              placeholder="busqueda"></r-input>
          </div>
        </div>
        <r-form-group title="Status:" class="mt-2">
          <r-select v-model="selectFiltroArchivo" :items="groupStore.getitemsFiltro"
            class="md:w-40 w-full mt-2 md:mt-0"></r-select>
        </r-form-group>
      </div>
    </div>

    <div class="w-full">
      <div class="flex flex-wrap -mx-2">
        <div class="md:w-1/3 w-full px-2 my-2" v-for="group in groupStore.getGroups" :key="group.id_group">
          <CardGroup :group="group" @delete:group="deleteGroup" @update:group="openModalEditGroup"
            @selected:group="selectedGroup"></CardGroup>
        </div>
        <div
          class="bg-white p-10 w-full flex justify-center text-xl text-sky-800 rounded-md shadow-sm border dark:bg-gray-700 dark:text-white"
          v-if="groupStore.getGroups.length == 0">
          <h3>No se encontraron grupos</h3>
        </div>
      </div>
      <div class="bg-white px-4 py-1 flex justify-end rounded-md shadow-sm dark:bg-gray-700"
        v-if="groupStore.getGroups.length > 0">
        <div class="grid place-content-center">
          <r-pagination v-model="currentPage" :total-pages="totalPages" variant="dark"></r-pagination>
        </div>
      </div>
    </div>
  </div>
  <r-modal v-model="modalAddEditGroup" size="md" hidden-footer :loading="loading"
    :title="(modeEdit ? 'Editar' : 'Agregar') + ' grupo'">
    <template #content>
      <form @submit.prevent="sendFormGroup">
        <r-form-group title="Nombre del grupo" class="mb-6">
          <r-input v-model="newGroup.name_group" type="text" placeholder="Grupo el suchil" :state-error="errorStore.errors && errorStore.errors.hasOwnProperty('name_group')
            " required></r-input>
          <r-error-input :errors="errorStore.errors" field="name_group"></r-error-input>
        </r-form-group>
        <r-form-group title="Fecha de inicio:" class="mb-6">
          <r-input v-model="newGroup.created_group" type="date" :state-error="errorStore.errors && errorStore.errors.hasOwnProperty('created_group')
            " required></r-input>
          <r-error-input :errors="errorStore.errors" field="created_group"></r-error-input>
        </r-form-group>
        <r-form-group title="Dia de pago:" class="mb-6">
          <div class="flex flex-wrap gap-2 mt-2">
            <r-btn-radio v-for="(item, index) in daysWeek" :key="index" v-model="(newGroup.day_payment as number)"
              :id="'day-payment-' + item" :value="DayWeek[item]" name="day-payment" variant="primary" :label="item">
            </r-btn-radio>
            <r-error-input :errors="errorStore.errors" field="day_payment"></r-error-input>
          </div>
        </r-form-group>

        <div class="flex justify-end">
          <r-btn type="submit" :disabled="loading">
            <r-spinner class="mr-2" size="btn" v-if="loading"></r-spinner>
            Guardar
          </r-btn>
        </div>
      </form>
    </template>
  </r-modal>
</template>
