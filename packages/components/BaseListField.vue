<script setup lang="ts">
import { computed, useId } from 'vue'
import { type Field, type Option } from '@v3technology/core'
import { type RadiobuttonListFieldProps } from '@v3technology/definitions'

import { useValue } from '~/composables/useFormState'
import OtherField from './other/OtherField.vue'

type Props = {
  //direction?: RadiobuttonListFieldProps['direction']
  allowOther?: RadiobuttonListFieldProps['allowOther']
  isOther: boolean
  field: Field
}

const props = defineProps<Props>()

// const { removeOption, addOption } = useEditorStore()
// const { isEditMode } = useEditorStoreRef()

// const onUpdate = (e: Event) => {
//   temp.value = (e.target as HTMLInputElement)?.value
// }
// const onSubmit = () => {
//   addOption(props.field, temp.value)
//   onCancel()
// }
const { defaultOtherField } = useValue(props, [] as Option[])
// const onCancel = () => {
//   temp.value = ''
// }
//const temp = ref<string>('')

const emptyOther = { label: 'Other', value: 'Other' } as Option
const direction = computed(() => props.field.props?.direction ?? 'horizontal')
//const allowOther = computed(() => props.allowOther)

const options = computed(() => {
  if (props?.allowOther) {
    return [...(props.field.options ?? []), emptyOther] as Option[]
  }
  return props.field.options as Option[]
})
const directionalClasses = computed(() => {
  let classes = []
  let length = options.value.length

  if (props.field.props?.columns < 1)
    return [`flex ${direction.value === 'vertical' ? 'flex-col' : 'flex-row'} gap-2`]

  if (direction.value === 'vertical') {
    classes.push(`grid grid-rows-${Math.ceil(length / (props.field.props?.columns ?? 4))}`)
  }
  classes.push(classes.push(`grid grid-cols-${props.field.props?.columns}`))

  return [...classes, 'gap-2']
})
const id = useId()
</script>

<template>
  <div :class="directionalClasses">
    <template v-for="(op, index) in options" :key="op.value">
      <div class="flex items-center gap-1.5">
        <slot name="options" :option="op" :index :id />
      </div>
    </template>

    <OtherField
      :isOther
      :defaultOtherField
      :field="props.field"
      :direction
      v-if="direction === 'horizontal'"
    >
      <slot />
    </OtherField>
  </div>

  <OtherField
    :isOther
    :defaultOtherField
    :field="props.field"
    :direction
    v-if="direction === 'vertical'"
  >
    <slot />
  </OtherField>
</template>
