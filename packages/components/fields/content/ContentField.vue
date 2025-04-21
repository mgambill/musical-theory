<script setup lang="ts">
import { type ContentFieldProps } from '@v3technology/definitions'
import { getFormStateContext } from '../../composables/useFormState'
import { type FieldProps } from '../../types'
import BaseField from '../BaseField.vue'
import InlineContent from '../InlineContent.vue'

const props = defineProps<FieldProps<ContentFieldProps>>()
const { field } = props
///const { updateField } = useEditorStore()
const { isEditMode } = getFormStateContext()
// const label = computed({
//   get: () => {
//     return field.label?.text ?? ''
//   },
//   set: (value: string) => {
//     if (fields) updateField({ ...toValue(field), label: { text: value } }, fields)
//   },
// })
</script>

<template>
  <BaseField v-bind="props">
    <template v-if="isEditMode && field">
      <InlineContent v-model="field.content" />
    </template>
    <template v-else>
      <p>{{ field.content }}</p>
    </template>
  </BaseField>
</template>
