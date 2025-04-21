import type { Form } from '@v3technology/core'
import * as field from '@v3technology/builder'
import { createOptions } from '@v3technology/builder'
import { type Condition, type Rule, rule, condition } from '~/rule-engine'

const form: Form = field.form({
  id: '27d3ac54-a13d-4a9e-9d4d-7b89b16e26d0',
  title: 'N-400 Questionnaire',

  fields: [
    field.section({
      id: '09587a3c-c873-4d12-870b-f143b0e8a613',
      fields: [
        field.text({
          id: '23364e29-b770-4477-a852-d5c24f905418',
          property: 'username',
          label: 'Username',
          placeholder: 'Enter your username',
          validation: 'required|length:5,15|alphanumeric',
          help: 'By default errors are shown on blur or submit',
          attrs: { autocomplete: 'off' },
        }),

        field.row(
          // Password field
          field.password({
            id: 'password-uuid',
            property: 'password',
            label: 'Password',
            validation: 'required',
          }),

          // Confirm Password field
          field.password({
            id: 'password-confirm-uuid',
            property: 'password_confirm',
            label: 'Confirm password',
            validation: 'required|confirm',
            validationLabel: 'Password confirmation',
          }),
        ),

        // Phone Number field with custom validation and messages
        field.text({
          id: 'phone-uuid',
          property: 'phone',
          label: 'Phone Number',
          validation: {
            required: true,
            matches: /^\d{3}-\d{3}-\d{4}$/,
          },
          validationMessages: {
            matches: 'Phone number must be formatted: xxx-xxx-xxxx',
          },
          validationVisibility: 'dirty',
          autocomplete: 'off',
          placeholder: 'xxx-xxx-xxxx',
        }),

        // Twitter Handle field
        field.text({
          id: 'twitter-handle-uuid',
          property: 'twitter_handle',
          label: 'Twitter Handle',
          placeholder: '@username',
          validation: 'required|starts_with:@|length:5',
          validationVisibility: 'live',
          autocomplete: 'off',
        }),
      ],
    }),
  ],
})

export default form
