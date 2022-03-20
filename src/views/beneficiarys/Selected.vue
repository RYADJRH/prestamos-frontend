<script setup lang="ts">
import { ref } from "vue";
import { useBeneficiaryStore } from "@/stores/beneficiary.store";
import RModal from "@/components/shared_components/rComponents/RModal.vue";
import CardUser from "@/components/shared_components/beneficiarys/CardUser.vue";
import RBtn from "@/components/shared_components/rComponents/RBtn.vue";
import RFormGroup from "@/components/shared_components/rComponents/RFormGroup.vue";
import RInput from "@/components/shared_components/rComponents/RInput.vue";

/* beneficiary store */
const beneficiaryStore = useBeneficiaryStore();
const beneficiarys = beneficiaryStore.getBeneficiarys;

/* modal */
const modalAddBeneficiary = ref(false);
const nick_name_user = ref("");

const i = ref(0);
function saveBeneficiary() {
  beneficiaryStore.$patch((state) => {
    state.beneficiarys.push({
      id_beneficiary: i.value++,
      name_acronym: "AA",
      name_beneficiary: "HOla mundo",
      id_user: 1,
    });
  });
  console.log(nick_name_user.value);
}

</script>
<template>
  <div class="lg:h-screen flex flex-col justify-center items-center py-4 lg:py-0">
    <h1 class="text-4xl text-center mb-5 text-white">Selecciona un beneficiario</h1>

    <div class="w-2/3 flex flex-wrap justify-center">
      <div
        class="w-full md:w-1/2 lg:w-1/5"
        v-for="beneficiary in beneficiarys"
        :key="beneficiary.id_beneficiary"
      >
        <card-user :beneficiary="beneficiary"></card-user>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/5" v-if="beneficiarys.length < 5">
        <card-user
          add
          :beneficiary="{
            id_beneficiary: -1,
            name_beneficiary: 'Agregar',
            name_acronym: '+',
            id_user: -1,
          }"
          @click="modalAddBeneficiary = true"
        ></card-user>
      </div>
    </div>
    <div class="mt-6" v-if="beneficiarys.length > 0">
      <r-btn variant="outline-light">Editar perfiles</r-btn>
    </div>
  </div>
  <Teleport to="body">
    <r-modal v-model="modalAddBeneficiary" size="md" title="Agregar Benficiario">
      <template #content>
        <r-form-group title="Nombre del beneficiario:">
          <r-input
            v-model="nick_name_user"
            type="text"
            placeholder="Rafael De Jesus Rebolledo Hernandez"
            class="mt-2"
            required
          ></r-input>
        </r-form-group>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <r-btn type="button" @click="saveBeneficiary">Guardar</r-btn>
        </div>
      </template>
    </r-modal>
  </Teleport>
</template>
