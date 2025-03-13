<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { ref } from 'vue'
import { type LikertFieldProps } from '@v3technology/definitions'

import { useEditorStoreRef } from '../../editor/store'
import { useValue } from '~/composables/useFormState'
import { type FieldProps } from '~/types'
import type { StringDictionary } from '@v3technology/core'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
const props = defineProps<FieldProps<LikertFieldProps>>()
const { isEditMode = false } = useEditorStoreRef()
const onUpdate = (e: Event) => {
  console.log('onUpdate', e)
  temp.value = (e.target as HTMLInputElement)?.value
}
const onSubmit = () => {
  //addOption(props.field, temp.value);
  onCancel()
}

const onCancel = () => {
  temp.value = ''
}

const temp = ref<string>('')

const { value } = useValue(props, {} as StringDictionary)
</script>

<template>
  <BaseField v-bind="props">
    <div
      class="inline-grid border-2 border-gray-200 *:p-2 *:outline *:outline-1 *:outline-gray-200"
      :style="{
        'grid-template-columns': `minmax(0, 2fr) ${field.options?.map(() => '1fr').join(' ')}`,
      }"
    >
      <div></div>

      <template v-for="op in field.options" :key="op">
        <div class="text-center">{{ op.label }}</div>
      </template>

      <template v-for="f in field.fields" :key="f.id">
        <div class="">{{ f.label?.text }}</div>
        <template v-for="(op, index) in field.options" :key="`${field.id}-${op.value}`">
          <ValueComponent v-bind="props">
            <template #value>
              <div class="flex items-center justify-center gap-1.5">
                <template v-if="value[f.property ?? f.id]?.value === op.value">
                  <i class="fa fa-fw fa-check text-green-600"></i>
                </template>
                <template v-else>
                  <i class="fat fa-fw fa-dash opacity-50"></i>
                </template>
              </div>
            </template>
            <template #default>
              <label class="flex items-center justify-center gap-1.5">
                <PrimeVue.RadioButton
                  v-model="value[f.property ?? f.id]"
                  :name="`fld-${field.id}-${index}`"
                  :value="op"
                />
              </label>
            </template>
          </ValueComponent>
        </template>
      </template>
    </div>

    <div>
      <template v-if="isEditMode && field">
        <template v-if="props.field.options?.length === 0">
          <div class="mb-1 animate-pulse italic text-gray-500">No items added...</div>
        </template>
        <hr />
        <div class="flex items-center gap-1.5 py-1">
          <span class="h-4 w-3 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
          <input
            :value="temp"
            @change="onUpdate"
            @keyup.esc="onCancel"
            @keyup.enter="onSubmit"
            placeholder="Add New Item"
            class="block flex-1 bg-zinc-100 p-1"
          />
        </div>
      </template>
    </div>
  </BaseField>
</template>
