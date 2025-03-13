import { test, assert, expect } from 'vitest'
import type { Condition, Modifier } from '../types'


test('getValueByPath', () => {
  const obj = {
    firstName: 'John',
    lastName: 'Doe',
  }

  const cond1: Condition = transform<typeof obj>({
    and: [
      {
        firstName: { eq: 'John' },
      },
      {
        lastName: { eq: 'Doe' },
      },
    ],
  })

  expect(cond1).toEqual({
    operator: 'And',
    conditions: [
      {
        property: 'firstName',
        operator: 'EqualTo',
        value: 'John',
      },
      {
        property: 'lastName',
        operator: 'EqualTo',
        value: 'Doe',
      },
    ],
  } as Condition)

  const cond2: Condition = transform<typeof obj>({
    or: [
      {
        firstName: { eq: 'John' },
      },
      {
        lastName: { eq: 'Doe' },
      },
    ],
  })

  expect(cond2).toEqual({
    operator: 'Or',
    conditions: [
      {
        property: 'firstName',
        operator: 'EqualTo',
        value: 'John',
      },
      {
        property: 'lastName',
        operator: 'EqualTo',
        value: 'Doe',
      },
    ],
  } as Condition)

  const cond3: Condition = transform<typeof obj>({
    firstName: null,
  })

  expect(cond3).toEqual({
    property: 'firstName',
    operator: 'IsNull',
  } as Condition)
})

test('transform', () => {
  const result = transform({ firstName: true })
  expect(result).toEqual({
    property: 'firstName',
    operator: 'IsTrue',
  } as Condition)
  // { property: "firstName", operator: "IsTrue" }
})

test('transform negation', () => {
  const result = transform({ firstName: not(null) })
  // test transform({ firstName: not(null) })
  // { property: "firstName", operator: "NotNull" }
})
test('transform negation', () => {
  const result = transform({ firstName: not({ eq: 'John' }) })
  expect(result).toEqual({ property: "firstName", operator: "NotEqualTo", value: "John" })
})
test('transform negation', () => {
  const result = transform({ and: [{ firstName: { eq: 'John' } }, { lastName: { eq: 'Doe' } }] })
  const actual = {
    operator: "And",
    conditions: [
      { property: "firstName", operator: "EqualTo", value: "John" },
      { property: "lastName", operator: "EqualTo", value: "Doe" }
    ]
  }
  expect(result).toEqual(actual)
})
type TransformOptionEquality = {
  eq: string
  neq: string
  gt: number
  gte: number
  lt: number
  lte: number
  in: (string | number)[]
  nin: any[]
}

type TransformOptions<T, K extends keyof T = any> =
  | {
      [K: string]: { [key: keyof TransformOptionEquality]: string | number | Date } | undefined | null | TransformOptions<T[K]>
    }
  | {
      and: TransformOptions<T>[]
    }
  | {
      or: TransformOptions<T>[]
    }

const operatorMap: Record<string, ComparisonOperators | LogicicalOperators | QuantifierOperators | ValueStateOperators> = {
  // Comparison Operators
  eq: 'EqualTo',
  neq: 'NotEqualTo',
  gt: 'GreaterThan',
  gte: 'GreaterThanOrEqualTo',
  lt: 'LessThan',
  lte: 'LessThanOrEqualTo',
  in: 'In',
  nin: 'IsNotIn',
  between: 'Between',
  startsWith: 'StartsWith',
  endsWith: 'EndsWith',
  contains: 'Contains',
  notContains: 'NotContains',

  // Logical Operators
  and: 'And',
  or: 'Or',
  not: 'Not',

  // Quantifier Operators
  any: 'Any',
  all: 'All',

  // Value State Operators
  isFalse: 'IsFalse',
  isTrue: 'IsTrue',
  isEmpty: 'IsEmpty',
  isNotEmpty: 'IsNotEmpty',
  isNull: 'IsNull',
  notNull: 'NotNull',
  isUndefined: 'IsUndefined',
  isDefined: 'IsDefined',
}
const not = (value: any) => ({ not: value })
const transform = <T>(condition: TransformOptions<T>): Condition => {
  if ('and' in condition) {
    return {
      operator: 'And',
      conditions: Array.isArray(condition.and) ? condition.and.map(transform) : [],
    }
  }

  if ('or' in condition) {
    return {
      operator: 'Or',
      conditions: Array.isArray(condition.or) ? condition.or.map(transform) : [],
    }
  }

  const keys = Object.keys(condition) as (keyof T)[]
  const [key] = keys
  const value = condition[key]

  if (value === null) {
    return {
      property: key as string,
      operator: 'IsNull',
    }
  }

  if (value === undefined) {
    return {
      property: key as string,
      operator: 'IsUndefined',
    }
  }

  if (value === true) {
    return {
      property: key as string,
      operator: 'IsTrue',
    }
  }

  if (value === false) {
    return {
      property: key as string,
      operator: 'IsFalse',
    }
  }

  if (typeof value === 'object') {
    // Handle 'not' shortcut
    if ('not' in value) {
      const innerCondition = transform({ [key]: value.not })
      return {
        ...innerCondition,
        operator: negateOperator(innerCondition.operator),
      }
    }

    const [operatorKey] = Object.keys(value) as (keyof typeof operatorMap)[]
    return {
      property: key as string,
      operator: operatorMap[operatorKey] || 'EqualTo',
      value: value[operatorKey],
    }
  }

  return {
    property: key as string,
    operator: 'EqualTo',
    value: value as string | number | boolean,
  }
}

const negateOperator = (operator: string): Condition['operator'] => {
  const negations: Record<string, Condition['operator']> = {
    IsEmpty: 'IsNotEmpty',
    IsNotEmpty: 'IsEmpty',
    IsNull: 'NotNull',
    NotNull: 'IsNull',
    IsTrue: 'IsFalse',
    IsFalse: 'IsTrue',
    Contains: 'NotContains',
    NotContains: 'Contains',
    EqualTo: 'NotEqualTo',
    NotEqualTo: 'EqualTo',
    In: 'IsNotIn',
    IsNotIn: 'In',
    LessThan: 'GreaterThanOrEqualTo',
    GreaterThan: 'LessThanOrEqualTo',
    LessThanOrEqualTo: 'GreaterThan',
    GreaterThanOrEqualTo: 'LessThan',
  }
  return negations[operator] || operator
}
