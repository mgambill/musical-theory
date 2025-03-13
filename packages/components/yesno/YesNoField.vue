<script setup lang="ts">
import { computed, useId } from 'vue'
import * as PrimeVue from 'primevue'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
import { type FieldProps } from '../../types'
import { type YesNoFieldProps } from '@v3technology/definitions'
import { useEditorStore } from '../../editor/store'
import InlineContent from '../InlineContent.vue'
import { useValue } from '../../composables/useFormState'

const props = defineProps<FieldProps<YesNoFieldProps>>()
const store = useEditorStore()
const { value } = useValue(props, null as boolean | null)
const direction = props.field.props?.direction ?? 'horizontal'

const formattedValue = computed(() => {
  if (!value.value) return null

  return value.value ? (props.field.props?.yesText ?? 'Yes') : (props.field.props?.noText ?? 'No')
})
const options = computed(() => [
  { label: props.field.props?.yesText ?? 'Yes', value: true },
  { label: props.field.props?.noText ?? 'No', value: false },
])
const id = useId()
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="formattedValue">
      <div :class="direction ? 'flex gap-4' : 'flex flex-col gap-4'">
        <template v-if="field.props?.layout === 'dropdown'">
          <PrimeVue.Select
            :options="options"
            v-model="value"
            optionLabel="label"
            optionValue="value"
          />
        </template>
        <template v-else>
          <template v-for="op in options" :key="op">
            <div class="flex items-center gap-1.5">
              <template v-if="store.isEditMode && field">
                <PrimeVue.RadioButton
                  v-model="value"
                  :inputId="`${field.id}-${op.value}-${id}`"
                  :name="`fld-${field.id}`"
                  :value="op.value"
                />
                <InlineContent v-model="op.label" />
              </template>
              <template v-else>
                <PrimeVue.RadioButton
                  v-model="value"
                  :inputId="`${field.id}-${op.value}-${id}`"
                  :name="`fld-${field.id}`"
                  :value="op.value"
                />
                <!-- <input type="radio" :name="`fld-${field.id}`" :id="`option-${field.id}-${op.value}`" v-model="value" :value="op.value"
              class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" /> -->
                <label :for="`option-${field.id}-${op.value}-${id}`">{{ op.label }}</label>
              </template>
            </div>
          </template>
        </template>
      </div>
    </ValueComponent>
  </BaseField>
</template>
