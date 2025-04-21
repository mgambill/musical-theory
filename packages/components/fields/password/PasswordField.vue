<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { useValue } from '../../composables/useFormState'
import type { PasswordFieldProps } from '@v3technology/definitions'

import { type FieldProps } from '../../types'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps<PasswordFieldProps>>()
//const { isEditor } = useEditor()
const { value } = useValue(props, '')
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="value ? '* * * * * *' : null">
      <PrimeVue.Password
        v-model="value"
        :feedback="false"
        toggleMask
        data-field="password"
        data-field-block
        class="*:w-full"
      />
    </ValueComponent>
  </BaseField>
</template>
