<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type FieldProps } from '../../types'
import Label from '../label/Label.vue'
import Wrapper from '../Wrapper.vue'

const props = defineProps<FieldProps>()
</script>

<template>
  <Wrapper v-bind="props">
    <PrimeVue.Divider>
      <Label class="text-sm">{{ props.field.label?.text }}</Label>
    </PrimeVue.Divider>
  </Wrapper>
</template>
