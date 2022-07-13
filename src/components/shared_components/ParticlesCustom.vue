<script setup lang="ts">

import { ref } from 'vue';

const props = defineProps<{
    bgColor: string,
    particlesColor: string
}>();



const optionsParticles = ref({
    background: {
        color: {
            value: props.bgColor
        }
    },
    fpsLimit: 90,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: props.particlesColor
        },
        links: {
            color: props.particlesColor,
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
        },
        collisions: {
            enable: true
        },
        move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 6,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 1000
            },
            value: 70
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'
        },
        size: {
            random: true,
            value: 5
        }
    },
    detectRetina: true
})

</script>

<template>
    <Particles id="tsparticles" :options="optionsParticles"></Particles>
</template>

<style lang="css" scoped>
#tsparticles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
}
</style>