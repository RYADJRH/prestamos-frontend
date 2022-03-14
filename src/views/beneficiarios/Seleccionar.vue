<script setup lang="ts">
import { ref } from 'vue';
import CardUser from '@/components/shared_components/beneficiarios/CardUser.vue';
import { Beneficiario } from "@/components/shared_components/beneficiarios/interfaces/Beneficiarios";
const beneficiarios = ref<Beneficiario[]>([]);


</script>
<template>
    <div class="lg:h-screen flex flex-col justify-center items-center py-4 lg:py-0">
        <h1 class="text-4xl text-center mb-5 text-white">Selecciona un beneficiario</h1>

        <div class="w-2/3 flex flex-wrap justify-center">
            <div
                class="w-full md:w-1/2 lg:w-1/5"
                v-for="beneficiario in beneficiarios"
                :key="beneficiario.id_beneficiary"
            >
                <card-user :beneficiario="beneficiario"></card-user>
            </div>
            <div class="w-full md:w-1/2 lg:w-1/5" v-if="beneficiarios.length < 5">
                <card-user
                    add
                    :beneficiario="{ id_beneficiary: -1, name_beneficiary: 'Agregar', name_acronym: '+', id_user: -1 }"
                ></card-user>
            </div>
        </div>

        <div class="mt-6" v-if="beneficiarios.length > 0">
            <button
                class="r-btn text-white border border-white hover:bg-white hover:text-sky-800"
            >Editar perfiles</button>
        </div>
    </div>
</template>
