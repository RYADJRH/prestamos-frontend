<script setup lang="ts">
import { useDialogStore } from "@/stores/dialog.store";
import RBtn from "./RBtn.vue";
import RModal from './RModal.vue';

const dialogStore = useDialogStore();

const variantThemeIcon = {
  'success': 'text-emerald-500',
  'error': 'text-red-500',
  'warning': 'text-yellow-500',
  'info': 'text-sky-500',
  'question': 'text-gray-500',
}

</script>

<template>
  <r-modal wrapper-class="z-[75]"  v-model="dialogStore.open" size="sm" hidden-footer hidden-header>
    <template #content>
      <div class="flex justify-center flex-col items-center gap-2">
        <component :is="dialogStore.icon" class="h-12 w-12" :class="variantThemeIcon[dialogStore.optionsDefault.variant]">
        </component>
        <h3 class="text-gray-600 font-semibold text-xl dark:text-white text-center">{{ dialogStore.optionsDefault.title }}</h3>
        <p className="text-center text-sm text-gray-600 dark:text-white">{{ dialogStore.optionsDefault.description }}</p>
        <div class="mt-4">
          <r-btn @click="dialogStore.cancel" class="mr-3" variant="danger" v-if="dialogStore.optionsDefault.confirm">
            Cancelar
          </r-btn>
          <r-btn @click="dialogStore.confirm" variant="success">Aceptar</r-btn>
        </div>
      </div>
    </template>
  </r-modal>
</template>
