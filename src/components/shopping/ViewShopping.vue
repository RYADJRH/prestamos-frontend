<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { ShoppingRequest } from "@/interfaces/shopping.interface";

import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RTable from "@/components/shared_components/rComponents/RTable.vue";
import RPagination from "@/components/shared_components/rComponents/RPagination.vue";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import NewUpdateShopping from "@/components/shopping/NewUpdateShopping.vue";
import { useShoppingStore } from "@/stores/shopping.store";
import { useAuthStore } from "@/stores/auth.store";
import { moneyMxn } from "@/utils/currency";
import { formatDate } from "@/utils/dates";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";
import { useDialogStore } from "@/stores/dialog.store";
import { useToast } from "vue-toastification";

const toast = useToast();
const shoppingStore = useShoppingStore();
const authStore = useAuthStore();
const dialogStore = useDialogStore();

const modalAddShopping = ref(false);
const loadingShopping = ref(false);
const shoppingEdit = ref<null | ShoppingRequest>(null);
const modeEdit = computed(() => !!shoppingEdit.value);

const fieldShopping = [
  { key: "product_name", name: "Nombre" },
  { key: "producto_price", name: "Precio" },
  { key: "date_shopping", name: "Fecha de compra" },
  { key: "acciones", name: "Acciones" },
];

const shoppings = computed(() => shoppingStore.getShoppings);

const fnGetShoppings = async (search = "") => {
  await shoppingStore
    .getApiShopping(
      authStore.profileBeneficiary?.id_beneficiary as number,
      search
    )
    .catch(() => { });
};

const currentPage = computed({
  get() {
    return shoppingStore.getCurrentPage;
  },
  async set(page: number) {
    shoppingStore.setCurrentPage(page);
    await fnGetShoppings();
  },
});

const totalPages = computed({
  get() {
    return shoppingStore.getTotalPages;
  },
  set(pages: number) {
    shoppingStore.setTotalPage(pages);
  },
});

const deleteShopping = (id: number) => {
  dialogStore
    .show({
      confirm: true,
      variant: "question",
      title: "¿Deseas eliminar esta compra?",
      description: "¡Esta acción es irreversible!",
    })
    .then(async (result) => {
      if (result) {
        await shoppingStore
          .deleteShopping(id)
          .then(async () => {
            if (shoppings.value.length == 0 && totalPages.value > 1) {
              await fnGetShoppings();
            }
            toast.success("¡La comprar ha sido eliminada con exito!")
          })
          .catch(() => {
            toast.error("¡No se pudo completar el registro!")
          });
      }
    });
};

const editShoppingModal = (data: ShoppingRequest) => {
  shoppingEdit.value = data;
  modalAddShopping.value = true;
};

onBeforeUnmount(() => {
  shoppingStore.$reset();
});
</script>
<template>
  <div>
    <div class="md:flex md:justify-between">
      <div class="flex items-end">
        <div class="block">
          <r-btn class="mr-2" @click="() => {
            shoppingEdit = null;
            modalAddShopping = true;
          }
            ">
            Nueva compra
          </r-btn>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <r-table :fields="fieldShopping" :items="shoppings" :hidden-footer="shoppings.length == 0">
        <template #cell(producto_price)="{ data }">
          {{ moneyMxn(+data.producto_price) }}
        </template>
        <template #cell(date_shopping)="{ data }">
          {{ formatDate(data.date_shopping, "LL") }}
        </template>
        <template #cell(acciones)="{ data }">
          <r-btn variant="danger" class="mr-3" @click="deleteShopping(data.id_shopping)">
            <TrashIcon class="h-4 w-4 text-white"></TrashIcon>
          </r-btn>
          <r-btn variant="success" class="mr-3" @click="editShoppingModal(data)">
            <PencilSquareIcon class="h-4 w-4 text-white"></PencilSquareIcon>
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
    <r-modal v-model="modalAddShopping" :loading="loadingShopping" :title="modeEdit ? 'Editar compra' : 'Nueva compra'"
      size="sm" hidden-footer>
      <template #content>
        <new-update-shopping :loading-save="loadingShopping" :shopping="shoppingEdit" @update:loading-save="(value) => {
          loadingShopping = value;
        }
          " @close:modal="modalAddShopping = false" />
      </template>
    </r-modal>
  </div>
</template>
