<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { computed } from 'vue'
import { useValue } from '../../composables/useFormState'
import { type FieldProps } from '../../types'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps>()

const { value } = useValue(props, null as Date | null)

const formattedValue = computed(() => {
  if (!value.value) return null
  const dt = new Date(value.value)
  return dt.toLocaleTimeString()
})
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="formattedValue">
      <PrimeVue.DatePicker
        v-model="value"
        iconDisplay="input"
        data-field="date"
        data-field-block
        timeOnly
        fluid
      >
        <template #inputicon="slotProps">
          <i class="fa fa-fw fa-clock" @click="slotProps.clickCallback" />
        </template>
      </PrimeVue.DatePicker>
    </ValueComponent>
  </BaseField>
</template>
