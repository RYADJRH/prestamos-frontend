
<script setup lang="ts">
import { inject, onBeforeMount, ref, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowSmallLeftIcon } from '@heroicons/vue/24/solid';
import { usePaymentStore } from '@/stores/payments.store';
import InfoPayments from '@/components/payments/InfoPayments.vue';
import ViewPayments from '@/components/payments/ViewPayments.vue';

const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();

const borrower = computed(() => paymentStore.getBorrower);

async function fnPaymentsBorrower() {
    await paymentStore.getApiPaymentsBorrowerPersonal(slug_borrower.value, id_borrow.value, 1)
        .catch(() => { });
}

const slug_borrower = ref("");
const id_borrow = ref(-1);
onBeforeMount(async () => {
    slug_borrower.value = route.params.slug as string;
    id_borrow.value = Number(route.params.id_borrow);
    setLoadingFull(true);
    paymentStore.setBorrower({ slug: slug_borrower.value, full_name: '', id_borrow: id_borrow.value });
    await fnPaymentsBorrower();
    setLoadingFull(false);
});

onBeforeUnmount(() => {
    paymentStore.$reset();
})

</script>
<template>
    <div>
        <div class="flex justify-between">
            <div class="flex items-center gap-2">
                <a class="text-gray-600 hover:text-red-800 cursor-pointer dark:text-white dark:hover:text-gray-300"
                    @click="router.push(`/prestamos-personales`)">
                    <ArrowSmallLeftIcon class="w-8 h-8"></ArrowSmallLeftIcon>
                </a>
                <h1 class="text-2xl text-gray-600 dark:text-white">Pagos - {{ borrower.full_name }}</h1>
            </div>

        </div>
        <info-payments class="mt-4"></info-payments>
        <view-payments class="mt-8" type="personal-loans"></view-payments>
    </div>
</template>