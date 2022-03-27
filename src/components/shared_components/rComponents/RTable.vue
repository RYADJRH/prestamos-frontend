<script setup lang="ts">
import { computed } from 'vue';
import RSpinner from '@/components/shared_components/rComponents/RSpinner.vue';

interface Field {
    key: string,
    name: string
}

const props = withDefaults(defineProps<{
    fields?: Field[] | string[],
    items: Record<string, string>[]
    loading?: boolean
}>(), { loading: false });


function fieldType(fields: Field | string): fields is Field {
    return (fields as Field).key === undefined;
}

const fields_keys = computed<Field[]>(() => {
    let fields_aux: Field[] = [];
    if (!props.fields || props.fields.length == 0) {
        if (props.items.length > 0) {
            const keys = Object.keys(props.items[0]);
            const fields = keys.map(key => <Field>{ key: key, name: key });
            fields_aux = fields;
        }
    } else if (fieldType(props.fields[0])) {
        fields_aux = props.fields.map(key => <Field>{ key: key, name: key });
    } else {
        fields_aux = props.fields as Field[];
    }
    return fields_aux;
})

</script>

<template>
    <div
        class="relative overflow-x-auto rounded-md shadow-lg md:max-h-94"
        :class="{ 'opacity-50': loading }"
    >
        <table class="w-full bg-white text-sm text-left text-gray-600">
            <thead class="uppercase border-b sticky top-0">
                <tr>
                    <th v-for="item in fields_keys" scope="col" class="px-6 py-3">{{ item.name }}</th>
                </tr>
            </thead>
            <tbody class="divide-y-2 divide-dashed divide">
                <tr v-for="item in items" v-if="!loading">
                    <td v-for="field in fields_keys" class="px-6 py-3">
                        <slot :name="`cell(${field.key})`" :data="item">{{ item[field.key] }}</slot>
                    </td>
                </tr>
                <tr v-if="loading">
                    <td :colspan="fields_keys.length">
                        <div class="inline-flex w-full justify-center p-6">
                            <r-spinner variant="danger" class="mr-3"></r-spinner>
                            <h1 class="text-xl text-red-800">Cargando...</h1>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="bg-white w-full border-t h-10 px-4" v-if="props.items.length > 0 && !loading">
            <slot name="footer"></slot>
        </div>
    </div>
</template>