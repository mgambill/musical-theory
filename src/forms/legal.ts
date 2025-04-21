import type { Form } from '@v3technology/core'
import * as field from '@v3technology/builder'
import { createOptions } from '@v3technology/builder'
import { type Condition, type Rule, rule, condition } from '~/rule-engine'

//import { condition } from '@v3technology/rule-engine'

const rules: Rule[] = [
  rule({
    label: 'age-check',
    trigger: 'milestone',
    condition: condition({
      property: 'age-check',
      property: 'dob.age()',
      operator: 'LessThanOrEqualTo',
      value: 18,
    }),
    actions: [
      {
        type: 'alert',
        message:
          'You must be at least 18 years old to apply for naturalization. Please contact us for assistance.',
        exit: true,
      },
    ],
  }),
  rule({
    label: 'crime-check',
    trigger: 'milestone',
    condition: condition({
      property: 'crime-check',
      property: 'crime',
      operator: 'IsTrue',
    }),
    actions: [
      {
        type: 'alert',
        message: 'Criminal records are not eligible for this application.',
        exit: true,
      },
    ],
  }),
  rule({
    label: 'marriage-check',
    trigger: 'immediate',
    condition: condition({
      property: 'marital',
      operator: 'NotEqualTo',
      value: 'married',
    }),
    actions: [
      {
        type: 'state',
        value: 'disabled',
        ids: ['marriage-questions'],
        exit: false,
      },
    ],
  }),
]
const form: Form = field.form({
  id: '27d3ac54-a13d-4a9e-9d4d-7b89b16e26d0',
  title: 'N-400 Questionnaire',
  name: 'N-400 Questionnaire',
  template: 'wizard',
  fields: [
    field.container({
      id: 'b7c9675a-0d6a-4706-ab8a-9285ee683c2c',
      label: 'Starting Questions',
      property: 'starting-questions',
      fields: [
        field.section({
          id: '09587a3c-c873-4d12-870b-f143b0e8a613',
          fields: [
            field.date({
              id: '23364e29-b770-4477-a852-d5c24f905418',
              property: 'dob',
              label: 'Date of Birth (mm/dd/yyyy)',
              valueType: 'age',
              validation: 'required',
            }),
            field.yesno({
              id: '5f96609d-1d92-40e6-a2fc-0ece38e16427',
              label: 'Have you ever been convicted of a crime',
              property: 'crime',
              validation: 'required',
            }),
            field.date({
              id: 'e2c99733-353f-4ee9-a89d-4206dd37b058',
              label: 'Date You Became a Lawful Permanent Resident (mm/dd/yyyy)',
              property: 'resident_date',
              validation: {
                required: 'Date you became a lawful permanent resident is required',
              },
            }),
            field.radiolist({
              id: 'a6dca597-2656-4c4c-a028-45734ba8009d',
              label: 'Gender',
              options: createOptions('Male', 'Female'),
              property: 'gender',
              direction: 'horizontal',
              columns: -1,
              validation: 'required',
            }),
            field.radiolist({
              id: '7b98f3ca-aa64-45bb-9d72-1824fb85cea2',
              label: 'What is your marital status',
              direction: 'vertical',
              validation: 'required',
              options: [
                {
                  value: 'single',
                  label: 'Single, Never Married',
                },
                {
                  value: 'married',
                  label: 'Married',
                },
                {
                  value: 'divorced',
                  label: 'Divorced',
                },
                {
                  value: 'widowed',
                  label: 'Widowed',
                },
                {
                  value: 'separated',
                  label: 'Separated',
                },
                {
                  value: 'annulled',
                  label: 'Marriage Annulled',
                },
              ],
              property: 'marital',
            }),
          ],
        }),
      ],
    }),
    field.container({
      id: '135693f9-1fad-45c5-be37-d4bc50bbf402',
      label: { text: 'Marriage Questions' },
      property: 'marriage-questions',
      disabled: condition({
        property: 'marital',
        operator: 'NotEqualTo',
        value: 'married',
      }),
      fields: [
        field.section({
          id: '2839304d-0041-457d-b262-39226a13991f',
          property: 'marriage-questions-spouse',
          fields: [
            field.yesno({
              id: '3f23b123-3553-4650-b88f-86649af26c5f',
              label: 'Is your current spouse a U.S. citizen?',
              property: 'spouse_citizen',
            }),
            field.date({
              id: 'c72fa342-b3ac-40aa-9547-fc1c69d95b69',
              label: 'Date You Entered into Marriage with Current Spouse (mm/dd/yyyy)',
              property: 'spouse_marriage_date',
            }),
            field.number({
              id: 'd2b8b2ca-3072-4f77-b93d-0abab8ac4fd0',
              label: 'How many years have you lived with your current spouse',
              property: 'spouse_live',
            }),
            field.yesno({
              id: '5d369f88-340f-4d5e-897b-e164616c784a',
              label: 'Is spouse engaged in specified employment abroad ',
              property: 'spouse_employment_abroad',
            }),
          ],
        }),
        field.section({
          id: '1cdbe341-e30e-4ede-b0f6-07374cee9b27',
          property: 'spouse_citizen_details',
          fields: [
            field.yesno({
              id: 'c89dc77f-6e8a-473b-a12e-5576946881e6',
              label: 'Was your spouse born a U.S. citizen?',
              property: 'spouse_citizen_birth',
            }),
            field.date({
              id: 'e4001ba8-0ba6-42cd-a4e4-19d4221e9dbd',
              label: 'When did your spouse become a U.S. citizen?',
              property: 'spouse_citizen_date',
            }),
          ],
        }),
      ],
    }),
    field.container({
      id: '8e666bdc-1cf9-4079-98a0-90e60dead11a',
      label: 'Information about your eligibility',
      property: 'eligibility',
      fields: [
        field.section({
          property: 'eligibility-set',
          fields: [
            field.text({
              label:
                'If your residential address is outside the United States and you are filing under Section 319(b), select the USCIS Field Office from the list below where you would like to have your naturalization interview:',
              property: 'elg_office',
            }),
            field.yesno({
              label:
                'Have been a lawful permanent resident of the United States for at least 5 years.',
              property: 'elg5',
              defaultValue: false,
            }),
            field.yesno({
              label:
                'Have been a lawful permanent resident of the United States for at least 3 years.  In addition, you have been married to and living with the same U.S. citizen spouse for the last 3 years, and your spouse has been a U.S. citizen for the last 3 years at the time you filed your Form N-400.',
              property: 'elg3',
              defaultValue: false,
            }),
            field.yesno({
              label:
                'Are a lawful permanent resident of the United States and you are the spouse of a U.S. citizen and your U.S. citizen spouse is regularly engaged in specified employment abroad.  (See the Immigration and Nationality Act (INA) section 319(b).)',
              property: 'elg_spouse',
              defaultValue: false,
            }),
            field.yesno({
              label: 'Are applying on the basis of qualifying military service.',
              property: 'elg_military',
            }),
            field.text({
              label: 'Other reason',
              property: 'elg_other',
            }),
          ],
        }),
      ],
    }),
    field.container({
      id: '01cf9a12-ea1b-426a-b9d8-bef9de87f673',
      label: 'Information about youself',
      property: 'information',
      fields: [
        field.section({
          id: '3c1d3ce5-5d4e-4909-95b6-c4b4701bdf5d',
          property: 'information-set',
          fields: [
            field.label('Your Current Legal Name (do not provide a nickname)'),
            field.row(
              field.text({
                id: '87dcb3ea-b559-4650-9818-57452aa3b8c6',
                label: 'Given Name (First Name)',
                property: 'legal_firstname',
              }),
              field.text({
                id: '5c93bdd2-3449-4d7d-832e-f52340153a82',
                label: 'Middle Name (if applicable)',
                property: 'legal_middlename',
              }),
              field.text({
                id: '826b8e9d-0463-4719-8a5c-55c3c65468c4',
                label: 'Family Name (Last Name)',
                property: 'legal_lastname',
              }),
            ),
            field.label({
              id: 'dce61ec3-f28f-416d-897a-d71301ae69cc',
              label:
                'Your Name Exactly As It Appears on Your Permanent Resident Card (if applicable)',
            }),
            field.row(
              field.text({
                id: '8b3a545b-8014-4eed-a4ec-72a340a9f21e',
                label: 'Given Name (First Name)',
                property: 'resident_card_firstname',
              }),
              field.text({
                id: 'c44856af-6a93-4bc6-af32-dfad514de9eb',
                label: 'Middle Name (if applicable)',
                property: 'resident_card_middlename',
              }),
              field.text({
                id: '25da2b15-ab5e-4fc3-9b7b-de9e21441d40',
                label: 'Family Name (Last Name)',
                property: 'resident_card_lastname',
              }),
            ),
            field.label(
              'Other Names You Have Used Since Birth (include nicknames, aliases, and maiden name, if applicable)',
            ),
            field.row(
              field.text({
                id: 'a877776c-dc08-43ca-9dc8-48e8fcb5cd7b',
                label: 'Given Name (First Name)',
                property: 'other_firstname',
              }),
              field.text({
                id: '7b6e223b-2701-4930-a1e7-b4767eb0765b',
                label: 'Middle Name (if applicable)',
                property: 'other_middlename',
              }),
              field.text({
                id: 'ed8b6d24-201e-4a87-8662-208d7bd081a8',
                label: 'Family Name (Last Name)',
                property: 'other_lastname',
              }),
            ),
            field.yesno({
              id: '2b486023-f166-45bc-8ac1-0cdae847012c',
              label: 'Would you like to legally change your name?',
              property: 'namechange',
              defaultValue: false,
            }),

            field.row(
              field.text({
                id: 'aa9377f6-92aa-4bca-ba39-80f90dbb9e7a',
                label: 'U.S. Social Security Number (if applicable)',
                property: 'ssn',
                pattern: '###-##-####',
              }),
              field.text({
                id: 'fb825e1a-5260-493d-9fe0-11c7c78b005e',
                label: 'USCIS Online Account Number (if any)',
                property: 'uscis',
                pattern: '###-###-###-###',
              }),
            ),

            field.row(
              field.text({
                id: '0245a0ab-204a-4431-905e-2389bc51c5ae',
                label: 'Country of Birth ',
                property: 'country_birth',
              }),
              field.text({
                id: '7d02d9c5-a52b-4e12-ba7e-46d02c8d0519',
                label: 'Country of Citizenship or Nationality',
                property: 'country_citizenship',
              }),
            ),
            field.yesno({
              id: 'eba63124-a696-4ec1-ba76-039915c1a560',
              label:
                'Do you have a physical or developmental disability or mental impairment that prevents you from demonstrating your knowledge and understanding of the English language and/or civics requirements for naturalization?',
              property: 'disability',
            }),
          ],
        }),
        field.section({
          id: '6a802fb9-fa86-433a-8fc9-06061a76ba67',
          property: 'namechange-set',
          disabled: condition({
            property: 'namechange',
            operator: 'EqualTo',
            value: false,
          }),
          fields: [
            field.label({
              label: {
                text: 'Read the Form N-400 Instructions before you decide whether or not you would like to legally change your name',
                bold: false,
              },
            }),
            field.row(
              field.text({
                label: 'Given Name (First Name)',
                property: 'new_firstname',
              }),
              field.text({
                label: 'Middle Name (if applicable)',
                property: 'new_middlename',
              }),
              field.text({
                label: 'Family Name (Last Name)',
                property: 'new_lastname',
              }),
            ),
          ],
        }),
        field.section({
          id: 'c756624a-7ca6-4fc3-a0f3-13b446aadf65',
          property: 'residency-set',
          fields: [
            field.yesno({
              label:
                'Are you 50 years of age or older and have you lived in the United States as a lawful permanent resident for periods totaling at least 20 years at the time you file your Form N-400?',
              property: 'lang50',
            }),
            field.yesno({
              label:
                'Are you 55 years of age or older and have you lived in the United States as a lawful permanent resident for periods totaling at least 15 years at the time you file your Form N-400?',
              property: 'lang55',
            }),
            field.yesno({
              label:
                'Are you 65 years of age or older and have you lived in the United States as a lawful permanent resident for periods totaling at least 5 years at the time you file your Form N-400?  (If you meet this requirement, you will also be given a simplified version of the civics test.)',
              property: 'lang65',
            }),
          ],
        }),
      ],
    }),
    field.container({
      label: 'Accommodations for Individuals With Disabilities and/or Impairments ',
      fields: [
        field.section({
          property: 'accom_disability-set',
          fields: [
            field.yesno({
              label:
                'Are you requesting an accommodation because of your disabilities and/or impairments?',
              property: 'accom_request',
            }),
          ],
        }),
        field.section({
          label: 'Accommodation Requested',
          property: 'accom_set',
          disabled: condition({
            property: 'accom_request',
            operator: 'EqualTo',
            value: false,
          }),
          fields: [
            field.consent({
              content: 'I am deaf or hard of hearing and request the following accommodation.',
              property: 'accom_deaf',
            }),
            field.text({
              label:
                '(If you are requesting a sign-language interpreter, indicate for which language (for example, American Sign Language).',
              property: 'accom_deaf_asst',
            }),
            field.consent({
              content: 'I am blind or have low vision and request the following accommodation:',
              property: 'accom_blind',
            }),
            field.text({
              label:
                'Describe the nature of your disability and/or impairment and the accommodation you are requesting',
              property: 'accom_blind_asst',
            }),
            field.consent({
              content:
                'I have another type of disability and/or impairment (for example, use a wheelchair).',
              property: 'accom_other',
            }),
            field.text({
              label:
                'Describe the nature of your disability and/or impairment and the accommodation you are requesting',
              property: 'accom_other_asst',
            }),
          ],
        }),
      ],
      property: 'accom_disability',
    }),
  ],
})

export default Object.assign(form, { rules })
