import { type ComponentDefinition } from './types'
import * as definitions from '@v3technology/definitions'

import { AddressField } from './components/address'
import { ButtonField } from './components/button'
import { CheckboxListField } from './components/checkboxList'
import { ConsentField } from './components/consent'
import { ContainerField } from './components/container'
import { ContentField } from './components/content'
import { DateField } from './components/date'
import { DateTimeField } from './components/datetime'
import { DividerField } from './components/divider'
import { DropdownField } from './components/dropdown'
import { HeadingField } from './components/heading'
import { LabelField } from './components/label'
import { LikertField } from './components/likert'
import { MultiSelectField } from './components/multiSelect'
import { NumberField } from './components/number'
import { PanelField } from './components/panel'
import { ParagraphField } from './components/paragraph'
import { PasswordField } from './components/password'
import { RadiobuttonListField } from './components/radiobuttonList'
import { RepeaterField } from './components/repeater'
import { RowField } from './components/row'
import { ScaleListField } from './components/scaleList'
import { SectionField } from './components/section'
import { SetField } from './components/set'
import { TextField } from './components/text'
import { TimeField } from './components/time'
import { YesNoField } from './components/yesno'

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
