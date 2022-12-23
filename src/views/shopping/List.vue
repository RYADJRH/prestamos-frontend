<script setup lang="ts">
import ViewShopping from "@/components/shopping/ViewShopping.vue";
import { useShoppingStore } from "../../stores/shopping.store";
import { useAuthStore } from "../../stores/auth.store";
import { onBeforeMount } from "vue";

const shoppingStore = useShoppingStore();
const authStore = useAuthStore();

const fnGetShoppings = async () => {
  await shoppingStore
    .getApiShopping(authStore.profileBeneficiary?.id_beneficiary as number, "")
    .catch(() => {});
};

onBeforeMount(() => {
  fnGetShoppings();
});
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl text-gray-600 dark:text-white">Compras</h1>
      </div>
    </div>
    <view-shopping class="mt-8" />
  </div>
</template>
