<script setup lang="ts">
import CardUser from "@/components/shared_components/beneficiarios/CardUser.vue";
</script>
<template>
    <div class="md:h-screen flex flex-col justify-center items-center py-4 md:py-0">
        <h1 class="text-4xl text-center mb-5 text-white">Selecciona un beneficiario</h1>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
            <card-user v-for="i in 5"></card-user>
        </div>
        <div class="mt-6">
            <button
                class="r-btn text-white border border-white hover:bg-white hover:text-sky-800"
            >Editar perfiles</button>
        </div>
    </div>
</template>
