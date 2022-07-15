
<script setup lang="ts">
import { inject, onBeforeMount, onBeforeUnmount } from 'vue';

import { useInvidualLoansStore } from '@/stores/individualLoans.store';
import { useAuthStore } from '@/stores/auth.store';

import InfoLoans from '@/components/personalLoans/InfoLoans.vue';
import ViewLoans from '@/components/personalLoans/ViewLoans.vue';


const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};
const authStore = useAuthStore();
const individualLoansStore = useInvidualLoansStore();

async function fnAmountsLoans() {
    await individualLoansStore.getApiAmountsLoans(authStore.profileBeneficiary?.id_beneficiary as number)
        .catch(() => { });
}

async function fnGetLoans() {
    await individualLoansStore.getApiLoans(authStore.profileBeneficiary?.id_beneficiary as number, 1, '')
        .catch(() => { });
}


onBeforeMount(async () => {
    setLoadingFull(true);
    await fnAmountsLoans();
    await fnGetLoans();
    setLoadingFull(false);
})

onBeforeUnmount(() => {
    individualLoansStore.$reset();
    setLoadingFull(false);

})
</script>
<template>
    <div>
        <div class="flex justify-between">
            <div class="flex items-center gap-2">
                <h1 class="text-2xl text-gray-600 dark:text-white">Prestamos personales</h1>
            </div>

        </div>
        <info-loans class="mt-4"></info-loans>
        <view-loans class="mt-8"></view-loans>
    </div>
</template>