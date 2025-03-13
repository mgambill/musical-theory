<script setup lang="ts">
import { useEditorStoreRef } from '../../editor/store'
import type { FieldProps } from '../../types'
import type { PanelFieldProps } from '@v3technology/definitions'
import * as PrimeVue from 'primevue'
import FieldComponent from '../FieldComponent.vue'
import Wrapper from '../Wrapper.vue'
// type Props = {}
const props = defineProps<FieldProps<PanelFieldProps> & { depth: number }>()
const { field, depth = 0 } = props
// const emits = defineEmits<{ click:[] }>()
const { isEditMode } = useEditorStoreRef()
</script>

<template>
  <Wrapper v-bind="props">
    <PrimeVue.Panel
      :header="field.label?.text"
      class="mb-4"
      pt:header:class="text-lg"
      pt:content:class="flex flex-col gap-4"
    >
      <template v-for="(f, index) in field.fields ?? []" :key="f.id">
        <FieldComponent :field="f" :index :depth="depth + 1" class="&>*:[data-field]:w-full" />
      </template>
      <template v-if="isEditMode">
        <p v-if="!field.fields?.length" class="p-1 italic text-gray-400">
          No Fields have been added to this row
        </p>
      </template>
    </PrimeVue.Panel>
  </Wrapper>
</template>
