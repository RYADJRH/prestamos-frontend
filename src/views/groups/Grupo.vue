<script setup lang="ts">
import { ref, onBeforeMount, inject, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import {
  CalendarIcon,
  ArchiveIcon,
  UserGroupIcon,
  CogIcon,
  CurrencyDollarIcon,
  ArrowSmLeftIcon,
} from "@heroicons/vue/solid";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RMenu from "@/components/shared_components/rComponents/RMenu.vue";
const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const router = useRouter();
const route = useRoute();
const settingsMenu = ref(false);
const settingsGroup = ref(null);

onClickOutside(settingsGroup, (event) => {
  settingsMenu.value = false;
});

onBeforeMount(() => {
  setLoadingFull(true);
  const slug = route.params.slug;
});


onBeforeUnmount(() => {
  setLoadingFull(false);
});
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <a class="text-gray-600 hover:text-red-800 cursor-pointer" @click="router.go(-1)">
          <ArrowSmLeftIcon class="w-8 h-8"></ArrowSmLeftIcon>
        </a>
        <h1 class="text-2xl">Grupo el suchil</h1>
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
                <ArchiveIcon class="h-6 w-6"></ArchiveIcon>Archivar
              </button>
            </li>
          </template>
        </r-menu>
      </div>
    </div>

    <div class="flex flex-wrap bg-white rounded-md p-4 mt-4 shadow-sm text-gray-600">
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CalendarIcon class="h-6 w-6"></CalendarIcon>
        Fecha : 24 de Octubre de 1994
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CalendarIcon class="h-6 w-6"></CalendarIcon>
        Dia de pago : Lunes
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <ArchiveIcon class="h-6 w-6"></ArchiveIcon>
        Status: Activo
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <UserGroupIcon class="h-6 w-6"></UserGroupIcon>
        No.miembros: 10
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
        Monto prestamo: $50,000.00
      </div>
      <div class="w-full lg:w-1/3 flex gap-4 my-2">
        <CurrencyDollarIcon class="h-6 w-6"></CurrencyDollarIcon>
        Monto recuperado: $25,000.00
      </div>
    </div>
    <div class="my-4">
      <h1 class="text-gray-600 text-lg">Miembros</h1>
      <div class="flex justify-between mt-4">
        <div>
          <r-btn>Agregar</r-btn>
        </div>
      </div>
    </div>
  </div>
</template>
