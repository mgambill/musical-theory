<script setup lang="ts">
import OptionsPartial from './OptionsPartial.vue'
import GeneralPartial from './GeneralPartial.vue'
import PropsPartial from './PropsPartial.vue'
import { useEditorStore } from '../store'
import type { Field } from '@v3technology/core'
import { storeToRefs } from 'pinia'

const store = useEditorStore()

const propsField = defineModel<Field>()
const { currentField } = storeToRefs(store)
//const { currentField: currentField, currentDefinition } = storeToRefs(store)
const field = computed({
  get: () => propsField.value ?? (currentField.value as Field),
  set: (value: Field) => {
    if (propsField.value) propsField.value = value
    else store.setCurrentField(value)
  },
})
</script>

<template>
  <GeneralPartial v-model:field="field"></GeneralPartial>
  <OptionsPartial v-model:field="field"></OptionsPartial>
  <PropsPartial v-model:field="field" />
</template>
