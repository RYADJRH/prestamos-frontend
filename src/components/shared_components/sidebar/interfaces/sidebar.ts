import { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';

interface itemSidebarChildSingle {
    link: string,
    title: string,
}

interface itemSidebar {
    link?: string,
    title: string,
    icon?: FunctionalComponent<HTMLAttributes & VNodeProps>,
    subMenu?: Array<itemSidebarChildSingle>

}

export { itemSidebar, itemSidebarChildSingle };