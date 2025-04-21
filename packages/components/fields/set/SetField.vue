<script setup lang="ts">
import { getFormStateContext } from '../../composables/useFormState'
import type { FieldProps } from '../../types'
import type { SectionFieldProps } from '@v3technology/definitions'
import * as PrimeVue from 'primevue'
import FieldComponent from '../FieldComponent.vue'
// type Props = {}
const props = defineProps<FieldProps<SectionFieldProps>>()
const { field, depth = 0 } = props
// const emits = defineEmits<{ click:[] }>()
const { isEditMode } = getFormStateContext()
</script>

<template>
  <Wrapper v-bind="props">
    <PrimeVue.Panel class="mb-2" pt:header:class="text-lg">
      <template v-for="(f, index) in field.fields ?? []" :key="f.id">
        <FieldComponent :field="f" :index :depth="depth + 1" class="&>*:[data-field]:w-full" />
      </template>
      <template v-if="isEditMode">
        <p class="p-1 italic text-gray-400">No Fields have been added to this row</p>
      </template>
    </PrimeVue.Panel>
  </Wrapper>
</template>
