import { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';

interface ItemSidebarChildSingle {
    link: string,
    title: string,
}

interface ItemSidebar {
    link?: string,
    title: string,
    icon?: FunctionalComponent<HTMLAttributes & VNodeProps>,
    subMenu?: Array<ItemSidebarChildSingle>

}

export { ItemSidebar, ItemSidebarChildSingle };