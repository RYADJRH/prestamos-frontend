<script setup lang="ts">
import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';


</script>

<template>
    <div
        class="bg-white p-3 shadow rounded-md hover:outline hover:outline-1 hover:outline-sky-800 hover:shadow-lg cursor-pointer"
    >
        <h5 class="font-bold text-gray-600 truncate">Grupo el suchil</h5>
        <div class="flex flex-col gap-1 mt-2">
            <span class="text-gray-500 text-sm">Fecha de inicio: 24 de octubre de 2022</span>
            <span class="text-gray-500 text-sm">Dia de pago : Lunes</span>
        </div>
        <div class="flex justify-end">
            <r-btn variant="danger" class="px-1 py-2 mr-3">
                <TrashIcon class="h-5 w-5"></TrashIcon>
            </r-btn>
            <r-btn variant="success" class="px-1 py-2">
                <PencilAltIcon class="h-5 w-5"></PencilAltIcon>
            </r-btn>
        </div>
    </div>
</template>