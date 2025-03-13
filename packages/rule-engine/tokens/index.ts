import type { TokenDefinition } from '../types/engine'

export const IsFalse: TokenDefinition = {
  name: 'IsFalse',
  handler: ({ property }) => property === false,
} as const
export const IsTrue: TokenDefinition = {
  name: 'IsTrue',
  handler: ({ property }) => property === true,
} as const

export const IsUndefined: TokenDefinition = {
  name: 'IsUndefined',
  handler: ({ property }) => property === undefined,
} as const
export const IsDefined: TokenDefinition = {
  name: 'IsDefined',
  handler: ({ property }) => property !== undefined,
} as const
export const IsNull: TokenDefinition = {
  name: 'IsNull',
  handler: ({ property }) => property === null,
} as const
export const NotNull: TokenDefinition = {
  name: 'NotNull',
  handler: ({ property }) => property !== null,
} as const

export const GreaterThan: TokenDefinition = {
  name: 'GreaterThan',
  handler: ({ value, property }) => property > value!,
} as const
export const GreaterThanOrEqualTo: TokenDefinition = {
  name: 'GreaterThanOrEqualTo',
  handler: ({ value, property }) => property >= value!,
} as const
export const LessThan: TokenDefinition = {
  name: 'LessThan',
  handler: ({ value, property }) => property != null ? property < value! : false,
} as const
export const LessThanOrEqualTo: TokenDefinition = {
  name: 'LessThanOrEqualTo',
  handler: ({ value, property }) => property != null ? property <= value! : false,
} as const
export const EqualTo: TokenDefinition = {
  name: 'EqualTo',
  handler: ({ value, property }) => property === value,
} as const
export const NotEqualTo: TokenDefinition = {
  name: 'NotEqualTo',
  handler: ({ value, property }) => property !== value,
} as const

const contains = ({ value, property }: { value?: any; property?: any } = {}) => {
  console.log({value, property})
  if (property === undefined || property === null) false

  if (Array.isArray(property)) {
    // if property is an Option object from form
    if (isOptionType(property[0])) {
      return (property as { value: any; label: string }[]).map((o) => o.value).includes(value)
    }

    return property.includes(value)
  }

  return property?.toString().includes(value.toString()) ?? false

  function isOptionType(source: any): source is { value: any; label: string } {
    return typeof source === 'object' && 'value' in source && 'label' in source
  }
}

export const Contains: TokenDefinition = {
  name: 'Contains',
  handler: ({ value, property }) => contains({ value, property }),
} as const
export const NotContains: TokenDefinition = {
  name: 'NotContains',
  handler: ({ value, property }) => !contains({ value, property }),
} as const
