<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { useValue } from '../../composables/useFormState'
import { type FieldProps } from '../../types'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
const props = defineProps<FieldProps>()
const { value } = useValue(props, false)
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props">
      <template #value>
        <div>{{ field.content }}</div>
        <div v-if="value === true"><i class="fa fa-fw fa-check text-green-600"></i> Accepted</div>
        <div v-else-if="value === false">
          <i class="fa fa-fw fa-xmark text-rose-600"></i> Not Accepted
        </div>
      </template>
      <template #default>
        <div class="grid grid-cols-[auto,1fr] gap-2">
          <PrimeVue.Checkbox
            :input-id="`fld-${field.property ?? field.id}`"
            v-model="value"
            binary
          />
          <label :for="`fld-${field.property ?? field.id}`">{{ field.content }}</label>
        </div>
      </template>
    </ValueComponent>
  </BaseField>
</template>
