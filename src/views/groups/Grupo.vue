<script setup lang="ts">
import { computed, ref, onBeforeMount, onBeforeUnmount, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import { ArchiveIcon, ArrowSmLeftIcon, CogIcon, CurrencyDollarIcon } from "@heroicons/vue/solid";
import { useIndividualGroupStore } from "@/stores/individualGroup.store";
import RMenu from "@/components/shared_components/rComponents/RMenu.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import InfoGroup from "@/components/groups/InfoGroup.vue";
import viewMember from "@/components/groups/members/ViewMember.vue";

import { Group } from "@/interfaces/group.interface";

const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const router = useRouter();
const route = useRoute();
const individualGroupStore = useIndividualGroupStore();
const group = computed(() => {
  return individualGroupStore.getGroup as Group;
});
const settingsMenu = ref(false);
const settingsGroup = ref(null);

onClickOutside(settingsGroup, (event) => {
  settingsMenu.value = false;
});

async function fnApiGroup() {
  await individualGroupStore.getApiGroup(slug.value).catch(() => { });
}

async function fnBorrowerGroup() {
  await individualGroupStore.getApiBorrowersGroup(slug.value, 1, "").catch(() => { });
}

const slug = ref("");
onBeforeMount(async () => {
  setLoadingFull(true);
  slug.value = route.params.slug as string;
  await fnApiGroup();
  await fnBorrowerGroup();
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
        <a class="text-gray-600 hover:text-red-800 cursor-pointer" @click="router.push('/grupos')">
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
              <router-link :to="`/grupo/pagos-vencidos/${group.slug}`"
                class="w-full flex gap-1 p-2 text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 rounded-md">
                <CurrencyDollarIcon class="h-6 w-6 mr-2"></CurrencyDollarIcon>
                Pagos vencidos
              </router-link>
            </li>
            <li>
              <button class="w-full flex gap-1 p-2 text-gray-500 hover:bg-sky-800/10 hover:text-sky-800 rounded-md">
                <ArchiveIcon class="h-6 w-6 mr-2"></ArchiveIcon>
                {{ group.state_archived_group ? "Proces" : "Archivar" }}
              </button>
            </li>
          </template>
        </r-menu>
      </div>
    </div>
    <info-group class="mt-4"></info-group>
    <view-member class="mt-8"></view-member>
  </div>
</template>
