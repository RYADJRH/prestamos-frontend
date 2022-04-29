<script setup lang="ts">
import { reactive, markRaw, ref, computed, onBeforeUnmount } from "vue";
import { XCircleIcon } from "@heroicons/vue/solid";
import { useDebounceFn } from "@vueuse/core";
import { useAddMemberGroup } from "@/stores/addMemberGroup.store";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import { useDialogStore } from "@/stores/dialog.store";

import { BorrowerGroupResponse } from "@/interfaces/borrower.interface";
import { AddMember } from "@/interfaces/groupBorrower.interface";

import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RSelectList from "@/components/shared_components/rComponents/RSelectList.vue";
import ItemListCardBorrowers from "@/components/groups/members/ItemListCardBorrowers.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";

const addMemberGroupStore = useAddMemberGroup();
const individualGroupStore = useIndividualGroupStore();
const dialogStore = useDialogStore();
const itemList = markRaw(ItemListCardBorrowers);

const props = withDefaults(
  defineProps<{
    loadingSave?: boolean;
    slugGroup: string;
    modeEdit: boolean;
    amountsBorrower: { amount_borrow: number; amount_interest: number } | null;
    selectedBorrower: {
      id_group_borrower?: number;
      id_borrower: number;
      full_name: string;
    } | null;
  }>(),
  {
    loadingSave: false,
  }
);

const emits = defineEmits<{
  (e: "update:loadingSave", value: boolean): void;
  (e: "close:modal"): void;
}>();

const initBorrower: AddMember = {
  id_borrower: props.selectedBorrower?.id_borrower ?? -1,
  slug_group: props.slugGroup,
  amount_borrow: props.amountsBorrower?.amount_borrow ?? 0,
  amount_interest: props.amountsBorrower?.amount_interest ?? 0,
};

const selectedBorrower = ref(props.selectedBorrower);

const loadingDataBorrower = ref(false);
const borrower = reactive({ ...initBorrower });

const searchBorrower = ref("");
const inputSearchDebounce = useDebounceFn(
  async () => {
    loadingDataBorrower.value = true;
    await addMemberGroupStore.listBorrowers(searchBorrower.value, props.slugGroup);
    loadingDataBorrower.value = false;
  },
  500,
  { maxWait: 1000 }
);
const dataSyncSearch = computed(() => addMemberGroupStore.getBorrowerList);

function selectBorrower(borrowerR: BorrowerGroupResponse) {
  const { id_borrower, full_name } = borrowerR;
  borrower.id_borrower = id_borrower;
  selectedBorrower.value = { id_borrower, full_name };
}

function removeSelectedBorrower() {
  borrower.id_borrower = -1;
  selectedBorrower.value = null;
}

async function guardar() {
  emits("update:loadingSave", true);
  if (props.modeEdit) {
    const id_group_borrower = props.selectedBorrower?.id_group_borrower as number;
    const { amount_borrow, amount_interest } = borrower;

    await addMemberGroupStore
      .updateMember({ id_group_borrower, amount_borrow, amount_interest })
      .then(async (member) => {

        individualGroupStore.setUpdateMember(member);
        await individualGroupStore.getApiGroup(props.slugGroup).catch(() => {});

        dialogStore.show({
          variant: "success",
          title: "Actualización exitosa",
          description: "¡El miembro ha sido actualizado!",
        });

      })
      .catch((err) => {
        dialogStore.show({
          variant: "error",
          title: "Ha ocurrido un error",
          description: "¡No se pudo completar el registro!",
        });
      });
  } else {
    await addMemberGroupStore
      .addMember(borrower)
      .then(async (member) => {
        individualGroupStore.setMember(member);
        await individualGroupStore.getApiGroup(props.slugGroup).catch(() => {});
        dialogStore
          .show({
            variant: "success",
            title: "Registro exitoso",
            description: "¡El nuevo miembro ha sido agregado!",
          })
          .then(() => {
            emits("close:modal");
          });
      })
      .catch((err) => {
        if (err.response.status == 302) {
          dialogStore
            .show({
              variant: "error",
              title: "Registro duplicado",
              description: "¡No se pudo completar el registro!",
            })
            .then(() => {
              emits("close:modal");
            });
        }
      });
  }
  emits("update:loadingSave", false);
}

onBeforeUnmount(() => {
  dialogStore.$reset();
  addMemberGroupStore.$reset();
});
</script>
<template>
  <form @submit.prevent="guardar">
    <r-form-group
      title="Busca y selecciona un prestatario:"
      class="mb-3"
      v-if="!selectedBorrower"
    >
      <r-select-list
        class="w-full mb-3"
        v-model="searchBorrower"
        @input="inputSearchDebounce"
        :data="dataSyncSearch"
        :item-layout="itemList"
        @click:item="selectBorrower"
        :loading="loadingDataBorrower"
      >
      </r-select-list>
    </r-form-group>

    <div
      class="p-3 flex items-center justify-between rounded-md bg-gray-600/5 mb-3"
      v-else
    >
      <p class="w-80 font-bold">{{ selectedBorrower?.full_name }}</p>
      <div
        class="w-20 flex justify-end"
        v-if="selectedBorrower && !modeEdit && !loadingSave"
      >
        <XCircleIcon
          class="h-8 w-8 text-red-800 cursor-pointer"
          @click="removeSelectedBorrower"
        ></XCircleIcon>
      </div>
    </div>

    <r-form-group title="Monto prestado:" class="mb-3">
      <r-input
        v-model="borrower.amount_borrow"
        type="text"
        class="text-right"
        :disabled="!selectedBorrower"
        currency
      ></r-input>
    </r-form-group>

    <r-form-group title="Monto interes:" class="mb-3">
      <r-input
        v-model="borrower.amount_interest"
        type="text"
        class="text-right"
        :disabled="!selectedBorrower"
        currency
      ></r-input>
    </r-form-group>

    <div class="flex justify-end">
      <r-btn :disabled="!selectedBorrower || loadingSave">
        <r-spinner v-if="loadingSave"></r-spinner>
        Guardar
      </r-btn>
    </div>
  </form>
</template>
