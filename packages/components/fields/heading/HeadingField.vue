<script setup lang="ts">
import { type HeadingFieldProps } from '@v3technology/definitions'
import { type FieldProps } from '../../types'
import Wrapper from '../Wrapper.vue'
import { computed } from 'vue'

const props = defineProps<FieldProps<HeadingFieldProps>>()
const { field } = props

const classes = computed(() => {
  const sizeMap = {
    'x-large': 'text-xl',
    large: 'text-lg',
    normal: 'text-base',
    small: 'text-sm',
  } as Record<NonNullable<HeadingFieldProps['size']>, string>

  const weightMap = {
    bold: 'font-medium',
    normal: 'font-normal',
    light: 'font-light',
  } as Record<NonNullable<HeadingFieldProps['weight']>, string>

  return [
    sizeMap[field.props?.size ?? 'large'],
    weightMap[field.props?.weight ?? 'light'],
    'text-gray-700',
  ]
})

const label = computed({
  get: () => field.label?.text,
  set: (value) => (field.label = { ...field.label, text: value }),
})
</script>

<template>
  <Wrapper v-bind="props">
    <p :class="classes">{{ label }}</p>
  </Wrapper>
</template>
