<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { CashIcon, HomeIcon, UserGroupIcon, UserIcon } from "@heroicons/vue/outline";
import Sidebar from "@/components/shared_components/sidebar/Sidebar.vue";
import { useSidebar } from '@/stores/sidebar.store';
const useSidebarStore = useSidebar();


const collapse = computed(() => useSidebarStore.isCollapseSidebar);

const menu = ref([
  {
    link: "/home",
    title: "Inicio",
    icon: HomeIcon,
  },
  {
    link: "/prestatarios",
    title: "Prestatarios",
    icon: UserIcon,
  },
  {
    link: "/grupos",
    title: "Grupos",
    icon: UserGroupIcon,
  },
  {
    link: "/prestamos-personales",
    title: "Prestamos personales",
    icon: CashIcon,
  },
]);

</script>
<template>
  <sidebar :collapse="collapse" :menu="menu">
    <template #content>
      <slot></slot>
    </template>
  </sidebar>
</template>
