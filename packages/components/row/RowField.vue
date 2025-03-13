<script setup lang="ts">
import { useEditorStoreRef } from '~/editor/store'
import { type FieldProps } from '~/types'
import { type RowFieldProps } from '@v3technology/definitions'
import Wrapper from '../Wrapper.vue'
import FieldComponent from '../FieldComponent.vue'

const props = defineProps<FieldProps<RowFieldProps & { expanded: boolean }>>()
const { field, depth = 0 } = props
const { expanded = true } = field.props ?? {}
const { isEditMode } = useEditorStoreRef()
</script>

<template>
  <Wrapper v-bind="props">
    <div
      class="editor:border-dashed editor:border editor:border-zinc-400 flex gap-4"
      :class="expanded && 'flex *:flex-1 [&_[data-field-block]]:w-full'"
      data-field="row"
    >
      <template v-for="(f, index) in field.fields ?? []" :key="f.id">
        <FieldComponent :field="f" :index :depth="depth + 1" />
      </template>
    </div>
    <template v-if="isEditMode && field.fields?.length === 0">
      <p class="p-1 italic text-gray-400">No Fields have been added to this row</p>
    </template>
  </Wrapper>
</template>
