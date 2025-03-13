<script setup lang="ts">
import { type Form } from '@v3technology/core'
import { type FieldProps } from '~/types'
import { type DisplayModes, useFormState } from '~/composables/useFormState'
import FormComponent from './FormComponent.vue'
import { useEditorStore } from '~/editor'

type Props = { form?: Form }
const props = defineProps<Props>()
// const emits = defineEmits<{ click:[] }>()
const form = ref<Form>(props.form || ({} as Form))
const mode = defineModel<DisplayModes>('mode', { default: 'entry' })
const datasource = defineModel<NonNullable<FieldProps['datasource']>>({
  required: true,
  default: {},
})

useEditorStore().setMode(mode.value)
useFormState(form, datasource, mode)
</script>

<template>
  <FormComponent :form="form" v-if="form" />
</template>
