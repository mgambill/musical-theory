import { defineComponent, h as VueRender } from 'vue'
import { type Field } from '@v3technology/core'
import { resolveComponentDefinition } from '../composables/useResolvers'

export const EmptyField = defineComponent(
  ({ field }: { field: Field }) => {
    const c = resolveComponentDefinition(field.control)
    return () => VueRender('div', `- Missing ${c?.label ?? field.control ?? 'Unknown'}`)
  },
  {
    name: 'EmptyField',
    props: ['field'],
  },
)

export default EmptyField
