<script setup lang="ts">
import { computed } from 'vue'
import Label from './Label.vue'
import { useEditorStore } from '../../editor/store'
import { type FieldProps } from '~/types'
import Wrapper from '../Wrapper.vue'
import InlineContent from '../InlineContent.vue'
const props = defineProps<FieldProps<{}> & { unwrapped?: boolean }>()
const { field, unwrapped = false } = props
const { isEditMode } = useEditorStore()
const label = computed(() => field.label?.text ?? '')
</script>

<template>
  <template v-if="unwrapped">
    <Label data-field="label" v-bind="field.label">{{ field.label?.text }}</Label>
  </template>
  <template v-else>
    <Wrapper v-bind="props">
      <template v-if="isEditMode && field">
        <InlineContent v-model="label" class="text-sm font-medium text-gray-700" />
      </template>
      <template v-else>
        <Label data-field="label">{{ field.label?.text }}</Label>
      </template>
    </Wrapper>
  </template>
</template>
