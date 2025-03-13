<script setup lang="ts">
import { type Field } from '@v3technology/core'
import FieldComponent from '../FieldComponent.vue'
// type Props = {}
const { isOther, ...props } = defineProps<{
  isOther: boolean
  defaultOtherField: Field
}>()
</script>

<template>
  <div v-if="isOther">
    <div class="hidden"><slot /></div>
    <FieldComponent :field="props.defaultOtherField" />
  </div>
</template>
