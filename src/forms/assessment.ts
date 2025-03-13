import type { Form } from '@v3technology/core'
import * as field from '@v3technology/builder'
import { createOptions } from '@v3technology/builder'
import type { Condition } from '@v3technology/rule-engine'
//import { condition } from '@v3technology/rule-engine'
const condition = (o: unknown) => o as Condition
const form: Form = field.form({
  title: 'SDOH Assessment',
  fields: [
    field.panel({
      label: 'CHW Information',
      fields: [
        field.yesno({
          label: 'Did you obtain consent from the patient?',
          validation: ['required'],
          property: 'chw',
        }),
      ],
    }),
    field.panel({
      label: 'Demographics and Contact Information',
      fields: [
        field.row(
          field.text({
            label: 'First Name',
            validation: ['required'],
            property: 'firstName',
            when: condition({
              property: 'chw',
              operator: 'IsTrue',
            }),
          }),
          field.text({
            label: 'Last Name',
            validation: 'required',
            property: 'lastName',
          }),
        ),
        field.row(
          field.text({
            label: 'Email Address',
            validation: ['required'],
            property: 'email',
          }),
          field.text({
            label: 'Phone Number',
            validation: ['required'],
            property: 'phone',
          }),
        ),
        field.radiolist({
          label: `Please select your age group.`,
          property: 'ageGroup',
          options: createOptions({ label: '0-17 years old', value: 17 }, { label: '18-34 years old', value: 34 }, { label: '35-49 years old', value: 49 }, { label: '50-64 years old', value: 64 }, { label: '65+ years old', value: 65 }),
        }),
        field.radiolist({
          label: `What is your Gender Identity.`,
          property: 'genderIdentity',
          direction: 'vertical',
          options: createOptions({ label: 'Female', value: 'female' }, { label: 'Male', value: 'male' }, { label: 'Transgender Female (MTF)', value: 'male_to_female' }, { label: 'Transgender Male (FTM)', value: 'female_to_male' }, { label: 'Gender Nonconforming', value: 'nonconforming' }, { label: 'Prefer not to state', value: 'not_stated' }),
          allowOther: true,
          other: field.text({
            label: `Description (If 'other' is selected)`,
            property: 'OtherGenderIdentityText',
            validation: {
              required: {
                when: {
                  property: 'genderIdentity',
                  operator: 'Contains',
                  value: 'Other',
                },
              },
            },
          }),
        }),
        field.checkboxlist({
          label: 'Please select your race (you may select more than 1)',
          property: 'race',
          direction: 'vertical',
          options: createOptions('White', 'Black or African American', 'American Indian or Alaskan Native', 'Asian Indian', 'Chinese', 'Filipino', 'Japanese', 'Korean', 'Vietnamese', 'Other Asian', 'Asian Unknown', 'Native Hawaiian', 'Guamanian or Chamorro', 'Samoan', 'Other Pacific Island', 'Native Hawaiian or Other Pacific Islander Unknown', 'Unspecified'),
        }),
        field.checkboxlist({
          label: 'Please select your ethnicity (you may select more than 1)',
          property: 'ethnicity',
          direction: 'vertical',
          options: createOptions('Asian', 'Black or African American', 'Hispanic, Latino or Spanish', 'Native American or Alaskan Native', 'Native Hawaiian or other Pacific Islander', 'Middle Eastern or North African', 'White or Caucasian'),
          allowOther: true,
        }),
        field.radiolist({
          label: `What is your marital status?`,
          property: 'maritalStatus',
          options: createOptions('Single', 'Married or lives with partner', 'Divorced or Separated', 'Widowed'),
        }),
        field.number({
          label: 'Number of people living in your household',
          property: 'householdSize',
          validation: ['required'],
        }),
        field.container({
          fields: [
            field.label('Please give the number for each of these groups of people in your household'),
            field.row(
              field.number({
                label: { text: '0-5 years', bold: false },
                property: 'householdSizeCount5',
                validation: ['required'],
              }),
              field.number({
                label: { text: '6-18 years', bold: false },
                property: 'householdSizeCount18',
                validation: ['required'],
              }),
              field.number({
                label: { text: '19+ years', bold: false },
                property: 'householdSizeCountOver19',
                validation: ['required'],
              }),
            ),
          ],
        }),
        field.radiolist({
          label: `What language are you most comfortable speaking?`,
          property: 'preferredLanguage',
          options: createOptions('English', 'Spanish', 'French'),
          allowOther: true,
          direction: 'horizontal',
        }),
        field.radiolist({
          label: `How comfortable are you speaking English?`,
          property: 'englishProficiency',
          direction: 'stacked',
          options: createOptions('Comfortable', 'Somewhat comfortable', 'Not comfortable'),
        }),
        // field.likert({
        //   label: `Do you have a history or have you ever been diagnosed with any of the following conditions?`,
        //   property: 'conditions',
        //   fields: createOptions('Diabetes', 'Prediabetes', 'High Cholesterol', 'Obesity', 'High blood pressure', 'Heart Disease', 'Stroke', 'Asthma', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Alzheimer', 'Cancer', 'HIV/AIDS', 'Substance Abuse'),
        //   options: createOptions('Yes', 'No'),
        //   headersAsOptions: true,
        // }),
      ],
    }),
    field.panel({
      label: 'Access to Health Care',
      fields: [
        field.yesno({
          label: 'Do you have a primary Care Doctor?',
          validation: ['required'],
          property: 'hasPrimaryCareDoctor',
        }),
        field.radiolist({
          label: 'Do you have a primary Care Doctor?',
          options: createOptions("Doctor's Office", 'Emergency Room', 'Urgent Care Clinic', 'Walk in/Community Clinic'),
          validation: ['required'],
          property: 'accessHealthCare',
          allowOther: true,
          other: field.text({
            label: `Description (If 'other' is selected)`,
            property: 'OtherAccessHealthCare',
            validation: {
              required: {
                when: {
                  property: 'accessHealthCare',
                  operator: 'Contains',
                  value: 'Other',
                },
              },
            },
          }),
        }),
        field.yesno({
          label: 'Do you have health insurance?',
          validation: ['required'],
          property: 'hasHealthInsurance',
        }),
        field.radiolist({
          label: 'What type of health insurance do you have?',
          options: createOptions('Medicare', 'Medicaid', 'Private Health Insurance'),
          property: 'whichHealthInsurance',
          when: condition({
            property: 'hasHealthInsurance',
            operator: 'IsTrue',
          }),
        }),
        field.yesno({
          label: 'Can we help you locate Health Insurance or a Primary Care Provider?',
          validation: ['required'],
          property: 'helpLocateHealthInsurance',
        }),
        field.yesno({
          label: 'In the past 12 months, have you been unable to get medicines or medical suppliers when it was really needed?',
          validation: ['required'],
          property: 'missingMedicines',
        }),
        field.checkboxlist({
          label: 'What prevented you from getting your medicines?',
          options: createOptions('Medical cost (such as copayment)', 'Lack of transportation', 'No caretaker'),
          allowOther: true,
          validation: ['required'],
          property: 'missingMedicinesReason',
        }),
        field.yesno({
          label: `In the past 12 months, have you been unable to keep your Doctor's appointments when it was really needed`,
          validation: ['required'],
          property: 'missingAppointments',
        }),
        field.checkboxlist({
          label: `What prevented you from keeping your doctor's appointment?`,
          options: createOptions('Medical cost (such as copayment)', 'Lack of transportation', 'No caretaker'),
          allowOther: true,
          validation: ['required'],
          property: 'missingAppointmentsReason',
        }),
        field.checkboxlist({
          label: `Do you need help in any of these needs?`,
          options: createOptions('Transportation', 'Caretaker'),
          allowOther: true,
          validation: ['required'],
          property: 'needsHelp',
        }),
      ],
    }),
  ],
})

export default form
