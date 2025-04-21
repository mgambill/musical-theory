<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type FieldProps } from '../../types'
import { useValue } from '../../composables/useFormState'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps>()
const { value } = useValue(props, '')
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="value">
      <PrimeVue.Textarea
        v-model="value"
        autoResize
        class="w-full"
        data-field="paragraph"
        data-field-block
      />
    </ValueComponent>
  </BaseField>
</template>
