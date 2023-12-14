<script setup lang="ts">
import { ref, inject } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useDarkModeStore } from '@/stores/darkMode.store';
import { useSidebar } from '@/stores/sidebar.store';

import { Bars3Icon, UsersIcon, ArrowRightOnRectangleIcon } from "@heroicons/vue/24/outline";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/solid";
import RMenu from "./rComponents/RMenu.vue";
import RBtn from "./rComponents/RBtn.vue";

const useSidebarStore = useSidebar();
const darkModeStore = useDarkModeStore();
const authStore = useAuthStore();
const router = useRouter();
const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const menu = ref(false);
const refMenuNavbar = ref(null);

onClickOutside(refMenuNavbar, (event) => {
  menu.value = false;
});

function openMenu() {
  menu.value = !menu.value;
}
function setModeDark() {
  darkModeStore.setModeTheme(!darkModeStore.dark)
}

async function logout() {
  setLoadingFull(true);
  await authStore.logout().finally(() => {
    router.replace({ name: "login" });
  });
  setLoadingFull(false);
}
</script>
<template>
  <nav class="sticky top-0 z-30">
    <div class="bg-sky-800 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <r-btn variant="outline-light" class="w-8 grid place-content-center"
              @click="useSidebarStore.toogleCollapseSidebar">
              <Bars3Icon class="h-4 w-4"></Bars3Icon>
            </r-btn>
            <h1 class="text-xl text-white ml-2 hidden md:block">Prestamos RRR</h1>
          </div>
          <div class="flex justify-center items-center gap-5">
            <div>
              <r-btn @click="setModeDark" class="w-8 grid place-content-center" variant="outline-light">
                <MoonIcon v-if="!darkModeStore.dark" class="h-4 w-4 text-white"></MoonIcon>
                <SunIcon v-if="darkModeStore.dark" class=" h-4 w-4 text-yellow-500">
                </SunIcon>
              </r-btn>
            </div>
            <div class="relative" ref="refMenuNavbar">
              <button @click="openMenu" class="rounded-full h-10 w-10 bg-white text-sky-800 font-bold dark:text-gray-800">
                {{ authStore.profileBeneficiary?.name_acronym }}
              </button>

              <RMenu v-model="menu" align="bottom-right" class="mt-2">
                <template #list>
                  <li>
                    <h1 class="font-bold dark:text-white">
                      {{ authStore.profileBeneficiary?.name_beneficiary }}
                    </h1>
                  </li>
                  <li>
                    <hr class="border-gray-400/15" />
                  </li>
                  <li>
                    <router-link to="/seleccionar/beneficiario"
                      class="flex gap-1 p-2 rounded-md text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 dark:text-gray-400 dark:hover:bg-gray-400/10 dark:hover:text-white">
                      <UsersIcon class="h-6 w-6"></UsersIcon>Cambiar beneficiario
                    </router-link>
                  </li>
                  <li>
                    <r-btn class="w-full flex items-center justify-center" variant="danger" @click="logout">
                      <ArrowRightOnRectangleIcon class="h-4 w-4 mr-3"></ArrowRightOnRectangleIcon>Cerrar sesión
                    </r-btn>
                  </li>
                </template>
              </RMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
