<script setup lang="ts" generic="T extends {}">
import LabelField from './label'
import { type FieldProps } from '../types'
import { getFormStateContext } from '../composables/useFormState'

import Wrapper from './Wrapper.vue'
const props = defineProps<FieldProps<T>>()
const { isEditMode } = getFormStateContext()
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
        <p class="text-xs py-2 opacity-80 font-normal" v-if="props.field.help">{{ props.field.help }}</p>
      </template>
    </div>
  </Wrapper>
</template>
