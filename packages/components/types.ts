import type { Field, StringDictionary } from '@v3technology/core'
import type { ControlDefinition } from '@v3technology/definitions'
import type { Component, DefineComponent } from 'vue'


export type FieldProps<P = object> = {
  field: Field<P>
  index?: number
  depth?: number
  parent?: Field
  fields?: Field[]
  datasource?: StringDictionary
  unwrapped?: boolean
}

export type ComponentDefinition = ControlDefinition & {
  component?: Component | DefineComponent | Promise<Component> | Promise<DefineComponent>
}
