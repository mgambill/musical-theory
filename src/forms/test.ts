import type { Form } from '@v3technology/core'
import * as field from '@v3technology/builder'

export const form: Form = field.form({
  title: 'test',
  fields: [
    field.repeater({
      label: 'Repeater Field',
      fields: [
        field.text({
          label: {
            visibility: 'hidden',
            bold: true,
            text: 'Text Field',
          },
          property: 'text-field',
        }),
        field.numeric({
          label: 'Numeric Field',
          property: 'numeric-field',
          defaultValue: 2,
        }),
      ],
      property: 'repeater-field',
    }),
  ],
})

export default form
