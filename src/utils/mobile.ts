import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
const isMobile = width.value < 768;

export {
    isMobile
}