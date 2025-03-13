<script setup lang="ts">
import { computed } from 'vue'
import {
  type RadiobuttonListFieldProps,
  type CheckboxListFieldProps,
} from '@v3technology/definitions'
import { type FieldProps } from '~/types'
import { type Field } from '@v3technology/core'
// type Props = {}
const { isOther, ...props } = defineProps<
  FieldProps<(RadiobuttonListFieldProps | CheckboxListFieldProps) & { other: Partial<Field> }> & {
    isOther: boolean
    defaultOtherField: Partial<Field>
  }
>()

const allowOther = props.field.props?.allowOther
const otherField = computed(() => {
  return (props.field.props?.other ?? props.defaultOtherField) as Partial<Field>
})
// const direction = props.field.props?.direction ?? 'horizontal'
// const emits = defineEmits<{ click:[] }>()
</script>

<template>
  <template v-if="allowOther && isOther">
    <template v-if="otherField">
      <div class="pt-4">
        <template v-if="otherField.control === 'text'">
          <TextField :field="otherField" class="my-2 ml-2 !max-w-96 border-l pl-3" />
        </template>
        <template v-else-if="otherField.control === 'paragraph'">
          <ParagraphField :field="otherField" class="my-2 ml-2 !max-w-96 border-l pl-3" />
        </template>
        <template v-else>
          <pre>{{ console.warn('Unsupported Other settings') }}</pre>
        </template>
      </div>
    </template>
    <template v-else>
      <!-- <div :class="[direction == 'vertical' ? 'grid-cols-[auto,1fr] gap-1.5 mt-1.5' : '', 'grid max-w-56 ']">
        <div class="invisible" v-if="direction === 'vertical'">
          <slot></slot>
        </div>

        <template v-if="otherField.control === 'text'">
          <TextField :field="otherField" class="my-2 ml-2 !max-w-96 border-l pl-3" />
        </template>
        <template v-else-if="otherField.control === 'paragraph'">
          <ParagraphField :field="otherField" class="my-2 ml-2 !max-w-96 border-l pl-3" />
        </template>
        <template v-else>
        </template>
      </div> -->
      <pre>{{ console.warn('Unsupported Other settings') }}</pre>
    </template>
  </template>
</template>
