
<script setup lang="ts">
import { inject, onBeforeMount, ref, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowSmLeftIcon } from '@heroicons/vue/solid';
import { usePaymentStore } from '@/stores/payments.store';
import InfoPayments from '@/components/payments/InfoPayments.vue';
import ViewPayments from '@/components/payments/ViewPayments.vue';

const setLoadingFull = inject("set-loading-full") as (value: boolean) => {};

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();

const borrower = computed(() => paymentStore.getBorrower);

async function fnPaymentsBorrower() {
    await paymentStore.getApiPaymentsBorrower(slug_group.value, slug_borrower.value, 1)
        .catch(() => { });
}

const slug_borrower = ref("");
const slug_group = ref("");
onBeforeMount(async () => {
    slug_group.value = route.params.slug_group as string;
    slug_borrower.value = route.params.slug_borrower as string;
    setLoadingFull(true);
    paymentStore.setBorrower({ slug: slug_borrower.value, full_name: '' });
    paymentStore.setGroup({ slug: slug_group.value, name: '' });
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
                    @click="router.push(`/grupo/${slug_group}`)">
                    <ArrowSmLeftIcon class="w-8 h-8"></ArrowSmLeftIcon>
                </a>
                <h1 class="text-2xl text-gray-600 dark:text-white">Pagos - {{ borrower.full_name }}</h1>
            </div>

        </div>
        <info-payments class="mt-4"></info-payments>
        <view-payments class="mt-8" type="borrower-payments"></view-payments>
    </div>
</template>