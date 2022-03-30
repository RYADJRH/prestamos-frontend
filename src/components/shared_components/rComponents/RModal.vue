<script setup lang="ts">
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RBackdrop from "@/components/shared_components/rComponents/RBackdrop.vue";
import { XIcon } from "@heroicons/vue/outline";

withDefaults(
  defineProps<{
    modelValue: boolean;
    size?: string;
    title: string;
    hiddenFooter?: boolean;
    loading?: boolean;
  }>(),
  {
    size: "sm",
    hiddenFooter: false,
    loading: false,
  }
);
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div class="modal" v-if="modelValue">
      <r-backdrop></r-backdrop>
      <div
        class="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out"
      >
        <div class="flex justify-center items-center min-h-screen pt-4 px-4 pb-10">
          <!-- modal -->
          <div
            class="relative bg-white rounded-md w-full"
            :class="{
              'md:w-1/4': size == 'sm',
              'md:w-2/4': size == 'md',
              'md:w-3/4': size == 'lg',
              'md:w-full': size == 'xl',
            }"
          >
            <!-- modal header -->
            <div
              class="modal-header h-14 flex items-center justify-between px-4 rounded-t-md border"
            >
              <h1 class="text-black font-bold text-xl">{{ title }}</h1>
              <r-btn
                variant="outline-light"
                class="focus:ring-black hover:bg-gray-900"
                @click="emits('update:modelValue', false)"
                :disabled="loading"
              >
                <XIcon class="h-4 w-4 text-gray-600"></XIcon>
              </r-btn>
            </div>
            <!-- modal content -->
            <div class="modal-content p-4">
              <slot name="content"></slot>
            </div>
            <!-- modal footer -->
            <div
              class="modal-footer h-14 border flex items-center px-4"
              v-if="!hiddenFooter"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
