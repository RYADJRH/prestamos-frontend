
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import colors from 'tailwindcss/colors';

import { Errors } from '@/interfaces/errors.interface';
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RBtn from '@/components/shared_components/rComponents/RBtn.vue';
import RFormGroup from '@/components/shared_components/rComponents/RFormGroup.vue';
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";
import Isotipo from "@/components/logos/Isotipo.vue";

const authStore = useAuthStore();
const router = useRouter();

const color = ref(colors.sky[900]);
const errors: Errors = ref(null);
const loading = ref(false);
const nick_name_user = ref('rebolledo');
const password = ref('R162608P');

async function login() {
    const crendentials = {
        nick_name_user: nick_name_user.value,
        password: password.value,
    }

    loading.value = true;
    errors.value = null;
    await authStore.login(crendentials)
        .then(() => {
            router.replace({ name: 'seleccionarBeneficiario' });
        })
        .catch((err) => {
            if (err.response.status) {
                errors.value = err.response.data.errors;
            }
        })
    loading.value = false;
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
            <r-form-group title="Nombre de usuario:">
                <r-input
                    v-model="nick_name_user"
                    type="text"
                    placeholder="ReboDev"
                    class="mt-2"
                    :stateError="errors != null && errors.hasOwnProperty('nick_name_user')"
                ></r-input>
                <r-error-input :errors="errors" field="nick_name_user"></r-error-input>
            </r-form-group>

            <r-form-group title="Contraseña:">
                <r-input
                    v-model="password"
                    type="password"
                    placeholder="**********"
                    autocomplete="on"
                    class="mt-2"
                ></r-input>
            </r-form-group>
            <div>
                <r-btn class="w-full" :disabled="loading">
                    <r-spinner class="mr-3" v-if="loading"></r-spinner>Iniciar sesión
                </r-btn>
            </div>
        </form>
    </div>
</template>


