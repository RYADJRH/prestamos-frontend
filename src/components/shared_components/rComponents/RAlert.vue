<script setup lang="ts">
import { useDialogStore } from "@/stores/dialog.store";
import RBtn from "./RBtn.vue";
const dialogStore = useDialogStore();
</script>

<template>
  <div class="z-[60] inset-0 fixed" v-if="dialogStore.open">
    <div class="flex items-center justify-center min-h-screen px-4 py-2">
      <div
        class="bg-white border shadow-xl md:w-1/3 w-full p-4 rounded-md flex items-center flex-col gap-y-4"
      >
        <component
          :is="dialogStore.icon"
          class="h-24 w-24"
          :class="{
            'text-emerald-500': dialogStore.optionsDefault.variant == 'success',
            'text-red-500': dialogStore.optionsDefault.variant == 'error',
            'text-yellow-500': dialogStore.optionsDefault.variant == 'warning',
            'text-sky-500': dialogStore.optionsDefault.variant == 'info',
            'text-slate-500': dialogStore.optionsDefault.variant == 'question',
          }"
        ></component>
        <h1 class="text-2xl uppercase text-center">{{ dialogStore.optionsDefault.title }}</h1>
        <p class="text-md text-gray-600 min-h-[5rem] text-center">
          {{ dialogStore.optionsDefault.description }}
        </p>
        <div>
          <r-btn
            @click="dialogStore.cancel"
            class="mr-3"
            variant="danger"
            v-if="dialogStore.optionsDefault.confirm"
          >
            Cancelar
          </r-btn>
          <r-btn @click="dialogStore.confirm" variant="success">Aceptar</r-btn>
        </div>
      </div>
    </div>
  </div>
</template>
