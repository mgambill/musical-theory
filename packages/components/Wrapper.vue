<script setup lang="ts" generic="T extends {}">
import { useEditorStoreRef, useEditorStore } from '~/editor/store'
import { type FieldProps } from '../types'
import {  useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const { field, nowrapper = false } = defineProps<Partial<FieldProps<T>> & {nowrapper?:boolean}>()
const { isEditMode,   } = useEditorStoreRef()
const { useBinding } = useEditorStore()

const attrs = useAttrs()
const bindings = useBinding(field, attrs)
</script>

<template>
  <template v-if="isEditMode && !nowrapper">
    <div v-bind="bindings">
      <slot />
    </div>
  </template>
  <template v-else> <slot /> </template>
</template>
