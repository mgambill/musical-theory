<script setup lang="ts">
import type { SectionFieldProps } from '@v3technology/definitions'
import type { FieldProps } from '../../types'
import { getFormStateContext } from '../../composables/useFormState'
import FieldComponent from '../FieldComponent.vue'
import Wrapper from '../Wrapper.vue'

const props = defineProps<FieldProps<SectionFieldProps>>()
const { field, depth = 0 } = props
const { isEditMode } = getFormStateContext()
</script>

<template>
  <Wrapper v-bind="props">
    <div class="flex flex-col gap-4">
      <template v-for="(f, index) in field.fields ?? []" :key="f.id">
        <FieldComponent :field="f" :index :depth="depth + 1" class="&>*:[data-field]:w-full" />
      </template>
      <template v-if="isEditMode">
        <p class="p-1 italic text-gray-400">No Fields have been added to this row</p>
      </template>
    </div>
  </Wrapper>
</template>
