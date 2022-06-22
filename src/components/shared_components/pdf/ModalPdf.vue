<script setup lang="ts">
import { ref, watch } from 'vue';
import RModal from '@/components/shared_components/rComponents/RModal.vue';

const props = defineProps<{
    modelValue: boolean,
    title: string,
    pdf: string
}>();


const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const show = ref(props.modelValue);

watch(() => props.modelValue, (value) => {
    show.value = value;
})

watch(() => show.value, (value) => {
    emits('update:modelValue', value);
})


</script>

<template>
    <r-modal v-model="show" :title="title" size="lg" hidden-footer>
        <template #content>
            <embed class="w-full h-screen" :src="pdf" type="application/pdf" />
        </template>
    </r-modal>
</template>