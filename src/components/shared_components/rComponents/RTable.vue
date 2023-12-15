<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import RSpinner from "@/components/shared_components/rComponents/RSpinner.vue";

interface Field {
  key: string;
  name: string;
}

const props = withDefaults(
  defineProps<{
    fields?: Field[] | string[];
    items: Record<string, any>[];
    loading?: boolean;
    shadowNone?: boolean;
    hiddenFooter?: boolean;
  }>(),
  { loading: false, hiddenFooter: false, shadowNone: false }
);

const itemsRef = ref<Record<string, any>[]>([]);

function fieldType(fields: Field | string): fields is Field {
  return (fields as Field).key === undefined;
}

const fields_keys = computed<Field[]>(() => {
  let fields_aux: Field[] = [];
  if (!props.fields || props.fields.length == 0) {
    if (props.items.length > 0) {
      const keys = Object.keys(props.items[0]);
      const fields = keys.map((key) => <Field>{ key: key, name: key });
      fields_aux = fields;
    }
  } else if (fieldType(props.fields[0])) {
    fields_aux = props.fields.map((key) => <Field>{ key: key, name: key });
  } else {
    fields_aux = props.fields as Field[];
  }
  return fields_aux;
});

watch(() => props.items, (items) => {
  itemsRef.value = [...items].map((item) =>
  ({
    ...item,
    collapse: false,
    toogle: function () {
      this.collapse = !this.collapse;
    }
  }));
}, { deep: true });


</script>

<template>
  <div class="relative overflow-x-auto rounded-md md:max-h-94"
    :class="{ 'opacity-50': loading, 'shadow-none': shadowNone, 'shadow-lg': !shadowNone }">
    <table class="w-full bg-white text-sm text-left text-gray-600 dark:bg-gray-700 dark:text-gray-300">
      <thead class="uppercase border-b sticky top-0">
        <tr>
          <th v-for="item in fields_keys" scope="col" class="px-6 py-3">
            <slot :name="`header(${item.key})`" :data="item"> {{ item.name }}</slot>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y-2 divide-dashed divide">
        <template v-for="item in itemsRef" v-if="!loading">
          <tr>
            <td v-for="field in fields_keys" class="px-6 py-3">
              <slot :name="`cell(${field.key})`" :data="item">{{ item[field.key] }}</slot>
            </td>
          </tr>

          <tr v-if="item.collapse">
            <td :colspan="fields_keys.length" class="w-full">
              <slot name="row-details" :data="item"></slot>
            </td>
          </tr>

        </template>

        <tr v-if="!loading && itemsRef.length == 0">
          <td :colspan="fields_keys.length">
            <div class="inline-flex w-full justify-center p-6 ">
              <h1 class="text-xl text-sky-800 dark:text-gray-400">
                <slot name="label-empty">Sin datos</slot>
              </h1>
            </div>
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
      <tfoot v-if="!loading && !props.hiddenFooter">
        <tr>
          <td :colspan="fields_keys.length" class="w-full border-t h-12 px-4 dark:bg-gray-700">
            <slot name="footer"></slot>
          </td>
        </tr>
      </tfoot>
    </table>

  </div>
</template>
