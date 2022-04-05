
<script setup lang="ts">
import { ref } from 'vue';
import { SearchIcon } from '@heroicons/vue/solid';
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RInput from '@/components/shared_components/rComponents/RInput.vue';
import RSelect from '@/components/shared_components/rComponents/RSelect.vue';
import RPagination from '@/components/shared_components/rComponents/RPagination.vue';
import CardGroup from '@/components/groups/CardGroup.vue';

const selectFiltroArchivo = ref(0);
const inputSearch = ref('');

const currentPage = ref(1);
const totolPages = ref(100);

</script>
<template>
    <div class="flex flex-col gap-5">
        <h1 class="text-2xl">Lista de grupos</h1>
        <div class="md:flex md:justify-between">
            <div class="md:grid md:place-content-center">
                <r-btn variant="primary">Agregar</r-btn>
            </div>

            <div class="md:flex block">
                <div class="relative md:mr-3 md:w-64 w-full mt-2 md:mt-0">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <SearchIcon class="h-6 w-6 text-gray-500"></SearchIcon>
                    </span>
                    <r-input
                        v-model="inputSearch"
                        class="pl-10"
                        type="search"
                        placeholder="busqueda"
                    ></r-input>
                </div>
                <r-select
                    v-model="selectFiltroArchivo"
                    :items="[{ text: 'En proceso', value: 0 }, { text: 'Archivado', value: 1 }]"
                    class="md:w-40 w-full mt-2 md:mt-0"
                ></r-select>
            </div>
        </div>

        <div class="w-full">
            <div class="flex flex-wrap -mx-2">
                <div class="md:w-1/3 w-full px-2 my-2" v-for="(item, index) in 6" :key="index">
                    <CardGroup></CardGroup>
                </div>
            </div>
            <div class="bg-white px-4 py-1 flex justify-end rounded-md shadow-sm">
                <div class="grid place-content-center">
                    <r-pagination v-model="currentPage" :total-pages="totolPages" variant="dark"></r-pagination>
                </div>
            </div>
        </div>
    </div>
</template>