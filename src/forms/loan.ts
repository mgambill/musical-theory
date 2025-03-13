import type { Form } from '@v3technology/core'
import * as field from '@v3technology/builder'
import { createOptions } from '@v3technology/builder'

const form: Form = field.form({
  id: '27d3ac54-a13d-4a9e-9d4d-7b89b16e26d0',
  title: 'Custom Form',
  fields: [
    field.panel({
      label: 'Basic Info',
      fields: [
        field.dropdown({
          label: 'Loan Currency',
          options: createOptions('USD', 'GBD'),
          validation: ['required'],
          property: 'currency',
        }),
        field.checkboxlist({
          label: `What is the loan's purpose?`,
          options: createOptions('Aquisition', 'Refinancing', 'Construction'),
          allowOther: true,
          other: field.paragraph({
            label: `Description (If 'other' is selected)`,
            property: 'OtherPurposeTypeDescription',
            validation: {
              required: {
                when: {
                  property: 'Purposes',
                  operator: 'Contains',
                  value: 'Other',
                },
              },
            },
          }),
          validation: ['required'],
          property: 'Purposes',
        }),
        field.yesno({
          label: 'Secured or unsecured?',
          yesText: 'Secured',
          noText: 'Unsecured',
          //allowEmpty: true,
          validation: ['required'],
          property: 'IsSecured',
        }),
        field.yesno({
          label: 'Married?',
          property: 'married',
        }),
        field.container(
          field.yesno({
            label: 'Married? b',
            property: 'married',
          }),
          field.yesno({
            label: 'Married? a',
            property: 'married',
          }),
        ),
        field.container({
          fields: [
            field.text({
              label: 'Spouse Name',
              property: 'spouse-name',
              // when: condition({
              //   property: 'married',
              //   operator: 'EqualTo',
              //   value: true,
              // }),
            }),
          ],
        }),
        field.text({
          label: 'Total loan commitment:',
          prefix: 'USD',
          hint: '',
          validation: ['required'],
          property: 'TotalLoanAmount',
        }),
        field.yesno({
          label: 'CMBS loan?',
          validation: ['required'],
          property: 'IsCMBS',
        }),
        field.yesno({
          label: 'Single Borrower Deal?',
          validation: ['required'],
          property: 'IsSingle',
        }),
        field.text({
          label: 'CMBS Deal Ticker',
          property: 'CMBSTicker',
        }),
      ],
    }),
  ],
})

export default form
