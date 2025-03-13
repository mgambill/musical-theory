<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { type RepeaterFieldProps } from '@v3technology/definitions'

import { type FieldProps } from '../../types'
import { useEditorStore } from '../../editor/store'
import { useValue } from '~/composables/useFormState'
import { FieldComponent, LabelField } from '../'
import type { Field, StringDictionary } from '@v3technology/core'
import BaseField from '../BaseField.vue'
const { isEditor = false } = useEditorStore()
const props = defineProps<FieldProps<RepeaterFieldProps>>()

const datasource = ref({} as StringDictionary)
const { value: local } = useValue(props, [] as StringDictionary[])
const resolveKey = (f: Field) => `${f.property ?? f.id!}`

const onAdd = () => {
  if (isEmpty.value) {
    return
  }
  const obj = {} as StringDictionary

  if (props.field.fields) {
    for (const f of props.field.fields) {
      const key = resolveKey(f)
      obj[key] = unref(datasource.value[key])
    }
  }
  local.value.push(obj)
  Object.entries(datasource.value).forEach(([key, _]) => {
    datasource.value[key] = null
  })
}

const onRemove = (index: number) => {
  local.value.splice(index, 1)
}

const isEmpty = computed(
  () =>
    Object.keys(datasource.value).length === 0 || Object.values(datasource.value).every((v) => !v),
)
</script>

<template>
  <BaseField v-bind="props">
    <div class="mt-2 grid grid-cols-[1fr,auto] gap-1">
      <div class="flex gap-2 *:flex-1">
        <template v-for="f in field.fields" :key="f.id">
          <LabelField v-bind="f.label" :field="f" />
        </template>
      </div>
      <div></div>
      <template v-for="(_, i) in local" :key="i">
        <div
          class="flex gap-2 *:flex-1 [&_[data-field=label]]:hidden [&_[data-field-block]]:w-full"
        >
          <template v-for="f in field.fields" :key="f.id">
            <FieldComponent
              :field="f"
              :parent="field"
              :index="i"
              :depth="props.depth ? props.depth + 1 : 0"
              :datasource="local[i]"
            />
          </template>
        </div>
        <button
          type="button"
          class="flex items-center rounded border-transparent px-3 hover:bg-zinc-100"
          @click="onRemove(i)"
        >
          <i class="fal fa-fw fa-xmark"></i>
        </button>
      </template>

      <hr class="col-span-full" />

      <div class="flex gap-2 *:flex-1 [&_[data-field=label]]:hidden [&_[data-field-block]]:w-full">
        <template v-for="f in field.fields" :key="f.id">
          <FieldComponent
            :field="f"
            :parent="field"
            :index="0"
            :depth="props.depth ? props.depth + 1 : 0"
            :datasource="datasource"
          />
        </template>
      </div>
      <button
        type="button"
        class="flex items-center rounded border-transparent px-3 :enabled:hover:bg-zinc-100 :disabled:text-red-50"
        @click="onAdd"
        :disabled="isEmpty"
      >
        <i class="fal fa-fw fa-plus"></i>
      </button>
    </div>

    <template v-if="isEditor">
      <p v-if="isEditor && !field.fields?.length" class="p-1 italic text-gray-400">
        No fields have been configured for the repeater
      </p>
    </template>
  </BaseField>
</template>
