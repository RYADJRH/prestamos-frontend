
<script setup lang="ts">
import { ref } from 'vue';
import Isotipo from "@/components/logos/Isotipo.vue";
import colors from 'tailwindcss/colors';
const bgColor = ref(colors.sky[900]);

</script>

<template>
    <div class="h-screen flex justify-center items-center px-3 md:px-0">
        <form class="w-full px-3 py-7 bg-white border rounded-md md:max-w-sm">
            <div class="mb-6 flex justify-center">
                <isotipo :color="bgColor" :height="150" :width="150"></isotipo>
            </div>
            <label class="block mb-6">
                <span class="text-gray-500">Correo electrónico:</span>
                <input
                    type="text"
                    class="r-input mt-2"
                    placeholder="correo@prestamosrrr.com"
                    required
                />
            </label>
            <label class="block mb-6">
                <span class="text-gray-500">Contraseña:</span>
                <input
                    type="password"
                    class="r-input mt-2"
                    placeholder="***********"
                    autocomplete="on"
                    required
                />
            </label>
            <label class="inline-flex items-center mb-6">
                <input type="checkbox" class="r-checkbox-primary" />
                <span class="ml-2 text-gray-500">Recordar sesión</span>
            </label>
            <div>
                <button class="r-btn-primary w-full">Iniciar Sesión</button>
            </div>
        </form>
    </div>
</template>


