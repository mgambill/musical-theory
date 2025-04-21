import { form, text, date, dropdown as select, row, panel, number, createOptions, yesno } from '@v3technology/builder'
import type { Condition } from '~/rule-engine'
//import { type Condition, condition } from '@v3technology/rule-engine'

const condition = (obj: Record<string, any>): Condition => {
  console.log('condition', obj)
  return {} as Condition
}

export const n400Form = form({
  title: 'N-400 Application for Naturalization',
  fields: [
    panel({
      label: 'Personal Information',
      fields: [text({ property: 'first_name', label: 'First Name', validation: 'required' }), text({ property: 'last_name', label: 'Last Name', validation: 'required' }), date({ property: 'dob', label: 'Date of Birth', validation: 'required' }), text({ property: 'ssn', label: 'Social Security Number', pattern: '###-##-####' }), text({ property: 'alien_number', label: 'Alien Registration Number', validation: 'required' })],
    }),

    panel({
      label: 'Residency & Eligibility',
      fields: [
        date({ property: 'green_card_date', label: 'Date of Permanent Residency', validation: 'required' }),
        select({
          property: 'marital_status',
          label: 'Marital Status',
          options: createOptions('Single', 'Married', 'Divorced', 'Widowed'),
        }),
        row(text({ property: 'spouse_name', label: 'Spouse Name', when: condition({ marital_status: 'Married' }) }), date({ property: 'marriage_date', label: 'Date of Marriage', when: condition({ marital_status: 'Married' }) })),
      ],
    }),

    panel({
      label: 'Travel History (Last 5 Years)',
      fields: [number({ property: 'total_trips', label: 'Total Trips Outside U.S.' }), row(date({ property: 'trip_start', label: 'Trip Start Date' }), date({ property: 'trip_end', label: 'Trip End Date' }), text({ property: 'trip_country', label: 'Country Visited' }))],
    }),

    panel({
      label: 'Moral Character',
      fields: [
        yesno({ property: 'criminal_record', label: 'Have you ever been arrested or committed a crime?' }),
        text({
          property: 'crime_details',
          label: 'If yes, provide details',
          when: condition({ criminal_record: true }),
        }),
        yesno({ property: 'tax_filing', label: 'Have you ever failed to file U.S. taxes?' }),
      ],
    }),

    panel({
      label: 'Oath of Allegiance',
      fields: [
        yesno({
          property: 'oath_willingness',
          label: 'Are you willing to take the Oath of Allegiance?',
        }),
      ],
    }),
  ],
})

export default n400Form
