
<script setup lang="ts">
import { Beneficiario } from "@/interfaces/beneficiario.interface";

withDefaults(defineProps<{
    add: boolean
    beneficiario: Beneficiario
}>(), {
    add: false
})
</script>

<template>
    <div class="h-56 flex justify-center">
        <div
            class="h-32 w-32 relative rounded-md bg-white border hover:border-2 hover:bg-gray-100 hover:border-sky-800 flex justify-center items-center cursor-pointer"
        >
            <slot name="acronym">
                <h1 class="text-6xl text-sky-800">{{ beneficiario.name_acronym }}</h1>
            </slot>
            <slot name="name-beneficiary">
                <p
                    class="absolute top-full text-center text-white mt-2"
                >{{ beneficiario.name_beneficiary }}</p>
            </slot>
        </div>
    </div>
</template>

