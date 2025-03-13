<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { computed, useId } from 'vue'
import { type Option } from '@v3technology/core'
import { type RadiobuttonListFieldProps } from '@v3technology/definitions'

import InlineContent from '../InlineContent.vue'
import { useEditorStoreRef } from '../../editor/store'
import { useValue } from '~/composables/useFormState'
import BaseField from '../BaseField.vue'
import { type FieldProps } from '~/types'
import BaseListField from '../BaseListField.vue'

const props = defineProps<FieldProps<RadiobuttonListFieldProps>>()
const { isEditMode } = useEditorStoreRef()
const { value: localValue } = useValue(props, null as Option | null)
const emptyOther = { label: 'Other', value: 'Other' } as Option
const direction = computed(() => props.field.props?.direction ?? 'horizontal')
const allowOther = computed(() => props.field.props?.allowOther)
const isOther = computed(() => {
  return (allowOther.value && localValue.value?.value === emptyOther.value) ?? false
})

const id = useId()

const options = computed(() => {
  if (props.field.props?.allowOther) {
    return [...(props.field.options ?? []), emptyOther] as Option[]
  }
  return props.field.options as Option[]
})
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="localValue">
      <template v-if="direction === 'stacked'">
        <div
          class="inline-grid border-2 border-gray-200 *:p-2 *:outline *:outline-1 *:outline-gray-200"
          :style="{ 'grid-template-columns': `${options.map(() => '1fr').join(' ')}` }"
        >
          <template v-for="op in options" :key="op">
            <template v-if="isEditMode && false">
              <InlineContent v-model="op.label" />
            </template>
            <template v-else>
              <label class="block text-center" :for="id">{{ op.label }}</label>
            </template>
          </template>
          <template v-for="op in options" :key="op">
            <div class="flex items-center justify-center">
              <PrimeVue.RadioButton
                v-model="localValue"
                :inputId="id"
                :name="`fld-${field.id}`"
                :value="op"
              />
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <BaseListField :isOther :field :allowOther>
          <template v-slot:options="{ option: op }">
            <PrimeVue.RadioButton
              v-model="localValue"
              :inputId="`${field.id}-${op.value}-${id}`"
              :name="`fld-${field.id}`"
              :value="op"
            />
            <label :for="`${field.id}-${op.value}-${id}`">{{
              'label' in op ? op.label : ''
            }}</label>
          </template>

          <template #default>
            <PrimeVue.RadioButton />
          </template>
        </BaseListField>
      </template>
    </ValueComponent>
  </BaseField>
</template>
