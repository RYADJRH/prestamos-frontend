<template>
    <div class="w-full h-56 flex justify-center">
        <div
            class="h-32 w-32 relative rounded-md bg-white border hover:border-2 hover:bg-gray-100 hover:border-sky-800 flex justify-center items-center cursor-pointer"
        >
            <slot name="acronym">
                <h1 class="text-6xl text-sky-800">RR</h1>
            </slot>
            <slot name="name-beneficiary">
                <p
                    class="absolute top-full text-center text-white mt-2 "
                >Rafael De Jesus Rebolledo Hernandez</p>
            </slot>
        </div>
    </div>
</template>

