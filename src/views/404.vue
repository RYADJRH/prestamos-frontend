<template>
    <div class="h-screen flex justify-center items-center">
        <div class="container bg-white p-3 rounded-md flex flex-col items-center">
            <img
                alt="page not found"
                src="@/assets/imagenes/not_found_img.svg"
                class="h-auto max-w-full md:w-1/3"
            />
            <h1 class="text-3xl text-gray-500">No se encontro esta página</h1>
            <router-link to="/" class="my-3 underline hover:text-gray-500">Pagina de inicio</router-link>
        </div>
    </div>
</template>