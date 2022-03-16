
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

import Isotipo from "@/components/logos/Isotipo.vue";
import colors from 'tailwindcss/colors';
const color = ref(colors.sky[900]);
const authStore = useAuthStore();

const name_nick_user = ref('rebolledo');
const password = ref('R162608P');
const remember_me = ref(false);

async function login() {
    const crendentials = {
        nick_name_user: name_nick_user.value,
        password: password.value,
        remember_me: remember_me.value
    }
    const userData = await authStore.login(crendentials)
    console.log(userData);
}
</script>

<template>
    <div class="h-screen flex justify-center items-center px-3 md:px-0">
        <form
            @submit.prevent="login"
            class="w-full px-3 py-7 bg-white border rounded-md md:max-w-sm"
        >
            <div class="mb-6 flex justify-center">
                <isotipo :color="color" class="h-32 w-32"></isotipo>
            </div>
            <label class="block mb-6">
                <span class="text-gray-500">Nombre de usuario:</span>
                <input
                    v-model="name_nick_user"
                    type="text"
                    class="r-input mt-2"
                    placeholder="ReboDev"
                    required
                />
            </label>
            <label class="block mb-6">
                <span class="text-gray-500">Contraseña:</span>
                <input
                    v-model="password"
                    type="password"
                    class="r-input mt-2"
                    placeholder="***********"
                    autocomplete="on"
                    required
                />
            </label>
            <label class="inline-flex items-center mb-6">
                <input type="checkbox" class="r-checkbox-primary" v-model="remember_me" />
                <span class="ml-2 text-gray-500">Recordar sesión</span>
            </label>
            <div>
                <button class="r-btn r-btn-primary w-full">Iniciar Sesión</button>
            </div>
        </form>
    </div>
</template>


