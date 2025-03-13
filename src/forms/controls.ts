import type { Form } from '@v3technology/core'
import * as field from '@v3technology/builder'
import { createOptions } from '@v3technology/builder'

const schema: Form = field.form({
  name: 'Kitchen Sink Sample',
  title: 'Kitchen Sink Sample',
  fields: [
    field.panel({
      label: 'Markup',
      fields: [
        field.row(field.label('Label Field'), field.label('Heading Field')),
        field.row(field.label('My Label'), field.header('A Heading')),
        field.row(field.label('Divider Only'), field.label('Divider with Text')),
        field.row(field.divider(''), field.divider({ label: 'My Divider' })),
        field.content({
          label: { visibility: 'hidden' },
          content: 'This is a content field',
        }),
      ],
    }),

    field.panel({
      label: 'Simple Fields',
      fields: [
        field.header({ label: 'Text Fields', weight: 'light', size: 'large' }),
        field.row(
          field.text({
            label: 'Text Field',
            property: 'text-field',
            defaultValue: 'default text',
          }),
          field.password({
            label: 'Password Field',
            property: 'inner-password-field',
            defaultValue: 'default password',
          }),
          field.numeric({
            label: 'Numeric Field',
            property: 'inner-numeric-field',
            defaultValue: 10,
          }),
        ),
        field.paragraph({
          label: 'Paragraph Field',
          property: 'paragraph-field',
          defaultValue: 'default paragraph',
        }),

        field.divider(),
        field.header({ label: 'Date & Time Fields', weight: 'light', size: 'large' }),
        field.row(
          field.date({
            label: 'Date Field',
            property: 'date-field',
            defaultValue: '@now()',
          }),
          field.datetime({
            label: 'Date/Time Field',
            property: 'datetime-field',
            defaultValue: '@now()',
          }),
          field.time({
            label: 'Time Field',
            property: 'time-field',
            defaultValue: '@now()',
          }),
        ),

        field.divider(),
        field.header({ label: 'Boolean Fields', weight: 'light', size: 'large' }),
        field.row(
          field.yesno({
            label: 'Yes No Field',
            property: 'yesno-field',
            defaultValue: true,
          }),
          field.consent({
            label: 'Consent Field',
            property: 'consent-field',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            defaultValue: true,
          }),
        ),
      ],
    }),
    field.panel({
      label: 'List Fields',
      fields: [
        field.row(
          field.dropdown({
            label: 'Dropdown Field',
            options: createOptions('Apple', 'Banana', 'Cherry'),
            property: 'dropdown-field',
          }),
          field.multiselect({
            label: 'MultiSelect Field',
            options: createOptions('Apple', 'Banana', 'Cherry'),
            property: 'multiselect-field',
          }),
        ),
        field.row(
          field.radiolist({
            label: 'Radio List Field',
            options: createOptions('Apple', 'Banana', 'Cherry'),
            property: 'radio-field',
          }),
          field.checkboxlist({
            label: 'Checkbox List Field',
            options: createOptions('Apple', 'Banana', 'Cherry'),
            property: 'checkbox-field',
            direction: 'horizontal',
          }),
        ),
        //field.chips({ label: 'Tag List' }),
        field.likert({
          label: `Likert Field`,
          property: 'likert-field',
          //options: createOptions('Comfortable', 'Somewhat comfortable', 'Not comfortable'),
          options: createOptions(
            { value: 1, label: 'Hate It' },
            { value: 2, label: 'Meh' },
            { value: 3, label: 'Love It' },
          ),
          fields: [
            field.item({ label: 'Apple', property: 'apple' }),
            field.item({ label: 'Banana', property: 'banana' }),
            field.item({ label: 'Cherry', property: 'cherry' }),
          ],
          //headers: createOptions('Alpha', 'Beta', 'Charlie'),
        }),

        field.scale({
          label: `Scale List Field`,
          //property: 'scalelist-field',
          min: 1,
          max: 5,
          fields: [
            field.item({
              label: 'My love of Apples',
              property: 'scale-field-apples',
            }),
            field.item({
              label: 'My love of Bananas',
              property: 'scale-field-bananas',
            }),
          ],
        }),
      ],
    }),

    field.panel({
      label: 'Compound Fields',
      fields: [
        field.address({
          label: 'Address Field',
          property: 'address-field',
          defaultValue: {
            lineOne: 'lineOne',
            lineTwo: 'lineTwo?',
            city: 'city',
            region: 'state',
            postalCode: 'zipcode',
          },
        }),
        field.divider(),
        field.repeater({
          label: 'Repeater Field',
          fields: [
            field.text({
              label: 'Text Field',
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
    }),
  ],
})

export default schema
