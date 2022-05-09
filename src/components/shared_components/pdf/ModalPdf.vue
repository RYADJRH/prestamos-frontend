<script setup lang="ts">
import { ref, watch } from 'vue';
import RModal from '@/components/shared_components/rComponents/RModal.vue';

const props = defineProps<{
    modelValue: boolean,
    title: string,
    pdf: string
}>();

// const show = ref(props.modelValue);

const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

watch(() => props.modelValue, (value) => {
    emits('update:modelValue', value);
})


</script>

<template>
    <r-modal v-model="modelValue" :title="title" size="lg" hidden-footer>
        <template #content>
            <iframe class="w-full h-screen" :src="pdf"></iframe>
        </template>
    </r-modal>
</template>