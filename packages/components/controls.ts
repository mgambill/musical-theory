import { type ComponentDefinition } from './types'
import * as definitions from '@v3technology/definitions'

import { AddressField } from './fields/address'
import { ButtonField } from './fields/button'
import { CheckboxListField } from './fields/checkboxList'
import { ConsentField } from './fields/consent'
import { ContainerField } from './fields/container'
import { ContentField } from './fields/content'
import { DateField } from './fields/date'
import { DateTimeField } from './fields/datetime'
import { DividerField } from './fields/divider'
import { DropdownField } from './fields/dropdown'
import { HeadingField } from './fields/heading'
import { LabelField } from './fields/label'
import { LikertField } from './fields/likert'
import { MultiSelectField } from './fields/multiSelect'
import { NumberField } from './fields/number'
import { PanelField } from './fields/panel'
import { ParagraphField } from './fields/paragraph'
import { PasswordField } from './fields/password'
import { RadiobuttonListField } from './fields/radiobuttonList'
import { RepeaterField } from './fields/repeater'
import { RowField } from './fields/row'
import { ScaleListField } from './fields/scaleList'
import { SectionField } from './fields/section'
import { SetField } from './fields/set'
import { TextField } from './fields/text'
import { TimeField } from './fields/time'
import { YesNoField } from './fields/yesno'

const componentMap = {
  buttonDefinition: ButtonField,
  labelDefinition: LabelField,
  panelDefinition: PanelField,
  dropdownDefinition: DropdownField,
  dateTimeDefinition: DateTimeField,
  singlelineDefinition: TextField,
  yesNoDefinition: YesNoField,
  dividerDefinition: DividerField,
  paragraphDefinition: ParagraphField,
  headingDefinition: HeadingField,
  dateDefinition: DateField,

  contentDefinition: ContentField,

  containerDefinition: ContainerField,

  //// chipsListDefinition: ChipsListField,
  rowDefinition: RowField,
  checkboxListDefinition: CheckboxListField,
  multiSelectDefinition: MultiSelectField,
  radiobuttonListDefinition: RadiobuttonListField,
  consentDefinition: ConsentField,
  numberDefinition: NumberField,
  passwordDefinition: PasswordField,
  timeDefinition: TimeField,

  addressDefinition: AddressField,
  repeaterDefinition: RepeaterField,
  likertDefinition: LikertField,
  setDefinition: SetField,
  //// ratingDefinition: RatingField,
  scaleListDefinition: ScaleListField,
  //// liveSearchDefinition: LiveSearchField,
  //// gridDefinition: GridField,
  //// markdownDefinition: MarkdownField,
  sectionDefinition: SectionField,
}

export const controls: ComponentDefinition[] = Object.keys(definitions)
  .filter((key) => key.endsWith('Definition'))
  .map((key) => {
    if (componentMap[key as keyof typeof componentMap]) {
      return {
        ...(definitions as Record<string, any>)[key],
        component: componentMap[key as keyof typeof componentMap],
      }
    }
    return (definitions as Record<string, any>)[key]
  })
