<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { computed, toValue } from 'vue'
import { type Option } from '@v3technology/core'
import { type CheckboxListFieldProps } from '@v3technology/definitions'
import { useValue } from '~/composables/useFormState'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
import { type FieldProps } from '~/types'

import BaseListField from '../BaseListField.vue'

const props = defineProps<FieldProps<CheckboxListFieldProps>>()
const { value: localValue } = useValue(props, [] as Option[])
const emptyOther = { label: 'Other', value: 'Other' } as Option
const allowOther = computed(() => props.field.props?.allowOther)
const isOther = computed(() => {
  return (
    (allowOther.value && toValue(localValue)?.some((x) => x.value == emptyOther.value)) ?? false
  )
})
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="localValue">
      <BaseListField :isOther :field :allowOther>
        <template v-slot:options="{ option: op }">
          <PrimeVue.Checkbox :inputId="`option-${op.value}`" v-model="localValue" :value="op" />
          <label :for="`option-${op.value}`">{{ 'label' in op ? op.label : '' }}</label>
        </template>

        <template #default>
          <PrimeVue.Checkbox />
        </template>
      </BaseListField>
    </ValueComponent>
  </BaseField>
</template>
