<script setup lang="ts">
import { reactive, onBeforeMount, computed } from "vue";
import { Shopping } from "@/interfaces/shopping.interface";
import { useAuthStore } from "@/stores/auth.store";
import { useErrorStore } from "../../stores/error.store";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import { useShoppingStore } from "../../stores/shopping.store";
import { formatDate } from "@/utils/dates";
import { ShoppingRequest } from "../../interfaces/shopping.interface";

const errorStore = useErrorStore();
const authStore = useAuthStore();
const shoppingStore = useShoppingStore();

const { profileId } = authStore;

const emits = defineEmits<{
  (e: "update:loadingSave", value: boolean): void;
  (e: "close:modal"): void;
}>();

const props = withDefaults(
  defineProps<{ loadingSave?: boolean; shopping?: ShoppingRequest | null }>(),
  {
    loadingSave: false,
    shopping: null,
  }
);

const newDataShopping: Shopping = {
  product_name: "",
  date_shopping: null,
  producto_price: 0,
  id_beneficiary: profileId,
};

const newShopping = reactive({ ...newDataShopping });
const modeEdit = !!props.shopping;

const saveShopping = async () => {
  emits("update:loadingSave", true);
  if (modeEdit) {
    await shoppingStore
      .updateShopping({
        ...newShopping,
        date_shopping: formatDate(
          newShopping.date_shopping as string,
          "YYYY-MM-DD"
        ),
      })
      .then(() => {
        emits("close:modal");
      })
      .catch((err) => {});
  } else {
    await shoppingStore
      .saveShopping({
        ...newShopping,
        date_shopping: formatDate(
          newShopping.date_shopping as string,
          "YYYY-MM-DD"
        ),
      })
      .then(() => {
        emits("close:modal");
      })
      .catch((err) => {});
  }
  emits("update:loadingSave", false);
};

onBeforeMount(() => {
  if (modeEdit) {
    const { id_shopping, product_name, producto_price, date_shopping } =
      props.shopping as ShoppingRequest;

    Object.assign(newShopping, {
      id: id_shopping,
      product_name,
      producto_price,
      date_shopping,
    });
  }
  errorStore.$reset();
});
</script>

<template>
  <form @submit.prevent="saveShopping">
    <r-form-group title="Nombre del producto o servicio:" class="mb-6">
      <r-input
        v-model="newShopping.product_name"
        type="text"
        placeholder="Netflix"
        class="mt-2"
        :stateError="
          errorStore.errors && errorStore.errors.hasOwnProperty('product_name')
        "
        required
      ></r-input>
      <r-error-input
        :errors="errorStore.errors"
        field="product_name"
      ></r-error-input>
    </r-form-group>
    <r-form-group title="Precio:" class="mb-6">
      <r-input
        v-model="newShopping.producto_price"
        type="text"
        placeholder="149.00"
        class="mt-2"
        :stateError="
          errorStore.errors &&
          errorStore.errors.hasOwnProperty('producto_price')
        "
        currency
        required
      ></r-input>
      <r-error-input
        :errors="errorStore.errors"
        field="producto_price"
      ></r-error-input>
    </r-form-group>
    <r-form-group title="Fecha de la compra:" class="mb-6">
      <Datepicker
        v-model="newShopping.date_shopping"
        locale="es"
        autoApply
        :enableTimePicker="false"
        position="center"
        teleport="#app"
        placeholder="selecciona una fecha"
        required
      />
      <r-error-input
        :errors="errorStore.errors"
        field="date_shopping"
      ></r-error-input>
    </r-form-group>
    <div class="flex justify-end">
      <r-btn :disabled="loadingSave || newShopping.date_shopping == null">
        <r-spinner v-if="loadingSave" class="mr-3" size="btn" />guardar
      </r-btn>
    </div>
  </form>
</template>
