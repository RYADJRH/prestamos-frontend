<script setup lang="ts">
import { MenuIcon } from "@heroicons/vue/outline"
</script>
<template>
    <nav class="sticky top-0">
        <div class="bg-sky-800">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <button type="button" class="r-btn p-2 text-white focus:ring-white" @click="$emit('toogleSidebar')">
                            <MenuIcon class="h-8 w-8"></MenuIcon>
                        </button>
                        <h1 class="text-xl text-white ml-2 hidden md:block">Prestamos RRR</h1>
                    </div>
                    <button class="rounded-full h-10 w-10 bg-white text-sky-800 font-bold">RR</button>
                </div>
            </div>
        </div>
    </nav>
</template>