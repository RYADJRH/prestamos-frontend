
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

const group = computed(() => paymentStore.getGroup);


async function fnPaymentsPastDue() {
    await paymentStore.getApiPaymentsPastDue(slug.value, 1, '')
        .catch(() => { });
}

const slug = ref("");
onBeforeMount(async () => {
    setLoadingFull(true);
    slug.value = route.params.slug as string;
    paymentStore.setGroup({ slug: slug.value, name: '' });
    await fnPaymentsPastDue();
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
                <a class="text-gray-600 hover:text-red-800 cursor-pointer" @click="router.push(`/grupo/${slug}`)">
                    <ArrowSmLeftIcon class="w-8 h-8"></ArrowSmLeftIcon>
                </a>
                <h1 class="text-2xl text-gray-600">Pagos vencidos - {{ group.name }}</h1>
            </div>

        </div>
        <info-payments class="mt-4"></info-payments>
        <view-payments class="mt-8" type="past-due-group"></view-payments>
    </div>
</template>