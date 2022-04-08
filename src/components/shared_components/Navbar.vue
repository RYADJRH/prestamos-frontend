<script setup lang="ts">
import { ref, inject } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { MenuIcon, UsersIcon, LogoutIcon } from "@heroicons/vue/outline";
import RMenu from "./rComponents/RMenu.vue";
import RBtn from "./rComponents/RBtn.vue";

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
    <div class="bg-sky-800">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <r-btn @click="$emit('toogleSidebar')" variant="outline-light">
              <MenuIcon class="h-4 w-4"></MenuIcon>
            </r-btn>

            <h1 class="text-xl text-white ml-2 hidden md:block">Prestamos RRR</h1>
          </div>
          <div class="relative" ref="refMenuNavbar">
            <button
              @click="openMenu"
              class="rounded-full h-10 w-10 bg-white text-sky-800 font-bold"
            >
              {{ authStore.profileBeneficiary?.name_acronym }}
            </button>

            <RMenu v-model="menu" align="bottom-right" class="mt-2">
              <template #list>
                <li>
                  <h1 class="font-bold">
                    {{ authStore.profileBeneficiary?.name_beneficiary }}
                  </h1>
                </li>
                <li>
                  <hr class="border-gray-400/15" />
                </li>
                <li>
                  <router-link
                    to="/seleccionar/beneficiario"
                    class="flex gap-1 p-2 text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 rounded-md"
                  >
                    <UsersIcon class="h-6 w-6"></UsersIcon>Cambiar beneficiario
                  </router-link>
                </li>
                <li>
                  <r-btn class="w-full" variant="danger" @click="logout">
                    <LogoutIcon class="h-5 w-5 mr-3"></LogoutIcon>Cerrar sesión
                  </r-btn>
                </li>
              </template>
            </RMenu>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
