<script setup lang="ts">
import { reactive, markRaw, ref, computed, onBeforeUnmount } from "vue";
import { XCircleIcon } from "@heroicons/vue/solid";
import { useDebounceFn } from "@vueuse/core";
import { useAddMemberGroup } from "@/stores/addMemberGroup.store";
import RSelectList from "@/components/shared_components/rComponents/RSelectList.vue";
import ItemListCardBorrowers from "@/components/groups/members/ItemListCardBorrowers.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import { BorrowerGroup, BorrowerGroupResponse } from "@/interfaces/borrower.interface";

const addMemberGroupStore = useAddMemberGroup();
const itemList = markRaw(ItemListCardBorrowers);

const props = defineProps<{
  slugGroup: string;
  modeEdit: boolean;
  amountsBorrower: { amount_borrow: number; amount_interest: number } | null;
  selectedBorrower: { id_borrower: number; full_name: string } | null;
}>();

const initBorrower: BorrowerGroup = {
  id_borrower: props.selectedBorrower?.id_borrower ?? -1,
  amount_borrow: props.amountsBorrower?.amount_borrow ?? 0,
  amount_interest: props.amountsBorrower?.amount_borrow ?? 0,
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

function guardar() {
  if (props.modeEdit) {


  } else {

  }
}

onBeforeUnmount(() => {
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
      <div class="w-20 flex justify-end" v-if="selectedBorrower">
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
      <r-btn :disabled="!selectedBorrower">Guardar</r-btn>
    </div>
  </form>
</template>
