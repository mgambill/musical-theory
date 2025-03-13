<script setup lang="ts" generic="T extends {}">
import LabelField from './label'
import { type FieldProps } from '../types'
import { useEditorStoreRef } from '~/editor/store'
import Wrapper from './Wrapper.vue'
const props = defineProps<FieldProps<T>>()
const { isEditMode } = useEditorStoreRef()
</script>

<template>
  <Wrapper v-bind="props">
    <div class="flex flex-col">
      <LabelField v-bind="props" unwrapped />
      <template v-if="isEditMode">
        <div class="pointer-events-none">
          <slot />
        </div>
      </template>
      <template v-else>
        <slot />
      </template>
    </div>
  </Wrapper>
</template>
