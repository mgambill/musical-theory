<script setup lang="ts">
import { useEditorStoreRef } from '../../editor/store'
import { type FieldProps } from '~/types'
import Wrapper from '../Wrapper.vue'
import FieldComponent from '../FieldComponent.vue'

import { type RowFieldProps } from '@v3technology/definitions'

const props = defineProps<FieldProps<RowFieldProps>>()
const { field, depth = 0 } = props
const { isEditMode } = useEditorStoreRef()
</script>

<template>
  <Wrapper v-bind="props">
    <div class="editor:border-dashed editor:border editor:border-zinc-400">
      <template v-for="(f, index) in field.fields ?? []" :key="f.id">
        <FieldComponent :field="f" :index :depth="depth + 1" class="&>*:[data-field]:w-full" />
      </template>
      <template v-if="isEditMode && field.fields?.length === 0">
        <p class="p-1 italic text-gray-400">No Fields have been added to this row</p>
      </template>
    </div>
  </Wrapper>
</template>
