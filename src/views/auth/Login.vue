<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import colors from "tailwindcss/colors";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useErrorStore } from "@/stores/error.store";

import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";
import RErrorInput from "@/components/shared_components/rComponents/RErrorInput.vue";
import Isotipo from "@/components/logos/Isotipo.vue";


import { useDarkModeStore } from '@/stores/darkMode.store';
const darkModeStore = useDarkModeStore();
const color = computed<string>(() => darkModeStore.dark ? colors.gray[400] : colors.sky[900])

const router = useRouter();
const authStore = useAuthStore();
const errorStore = useErrorStore();

const loading = ref(false);
const nick_name_user = ref("");
const password = ref("");

async function login() {
  const crendentials = {
    nick_name_user: nick_name_user.value,
    password: password.value,
  };

  loading.value = true;
  await authStore
    .login(crendentials)
    .then(() => {
      router.replace({ name: "seleccionarBeneficiario" });
    })
    .catch(() => { });
  loading.value = false;
}

onBeforeMount(() => errorStore.$reset());
</script>

<template>
  <div class="h-screen flex justify-center items-center px-3 md:px-0">
    <form @submit.prevent="login" class="w-full px-3 py-7 bg-white border rounded-md md:max-w-sm dark:bg-gray-700">
      <div class="mb-6 flex justify-center">
        <isotipo :color="color" class="h-32 w-32"></isotipo>
      </div>
      <r-form-group title="Nombre de usuario:" class="mb-6">
        <r-input v-model="nick_name_user" type="text" placeholder="ReboDev" class="mt-2"
          :stateError="errorStore.errors && errorStore.errors.hasOwnProperty('nick_name_user')"></r-input>
        <r-error-input :errors="errorStore.errors" field="nick_name_user"></r-error-input>
      </r-form-group>

      <r-form-group title="Contraseña:" class="mb-6">
        <r-input v-model="password" type="password" placeholder="**********" autocomplete="on" class="mt-2"></r-input>
      </r-form-group>
      <div>
        <r-btn class="w-full" type="submit" :disabled="loading">
          <r-spinner class="mr-2" v-if="loading" size="btn"></r-spinner>Iniciar sesión
        </r-btn>
      </div>
    </form>
  </div>
</template>
