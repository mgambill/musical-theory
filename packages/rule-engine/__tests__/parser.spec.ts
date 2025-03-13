import { test, expect } from 'vitest'
import { parse } from '../utils/parser'
import type { Condition } from '../types/condition'
import { or } from '../ConditionRunner'

// --- Existing Tests ---

test('parse simple condition', () => {
  const input = "$.property.path == 'value'"
  const expected: Condition = {
    operator: 'EqualTo',
    property: 'property.path',
    value: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse simple not condition', () => {
  const input = "$.property.path != 'value'"
  const expected: Condition = {
    operator: 'NotEqualTo',
    property: 'property.path',
    value: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse OR condition', () => {
  const input = "$.property.path == 'value' or $.model.age > 18"
  const expected: Condition = {
    operator: 'Or',
    conditions: [
      {
        operator: 'EqualTo',
        property: 'property.path',
        value: 'value',
      },
      {
        operator: 'GreaterThan',
        property: 'model.age',
        value: 18,
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse nested condition with parentheses', () => {
  const input = "$.property.path == 'value' And ($.model.age > 18 Or $.model.date > {CurrentDate})"
  const expected: Condition = {
    operator: 'And',
    conditions: [
      {
        operator: 'EqualTo',
        property: 'property.path',
        value: 'value',
      },
      {
        operator: 'Or',
        conditions: [
          {
            operator: 'GreaterThan',
            property: 'model.age',
            value: 18,
          },
          {
            operator: 'GreaterThan',
            property: 'model.date',
            value: '{CurrentDate}',
          },
        ],
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with array access', () => {
  const input = '$model.age == $.dataset[0].age'
  const expected: Condition = {
    operator: 'EqualTo',
    property: '$model.age',
    value: '$.dataset[0].age',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

// --- Additional Tests Covering All Operators ---

// Comparison Operators

test('parse condition with StartsWith operator', () => {
  const input = "$.name StartsWith 'John'"
  const expected: Condition = {
    operator: 'StartsWith',
    property: 'name',
    value: 'John',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with EndsWith operator', () => {
  const input = "$.name EndsWith 'Doe'"
  const expected: Condition = {
    operator: 'EndsWith',
    property: 'name',
    value: 'Doe',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with Like operator', () => {
  const input = "$.description Like 'lorem'"
  const expected: Condition = {
    operator: 'Like',
    property: 'description',
    value: 'lorem',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with NotLike operator', () => {
  const input = "$.description NOT Like 'ipsum'"
  const expected: Condition = {
    operator: 'NotLike',
    property: 'description',
    value: 'ipsum',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with In operator', () => {
  const input = "$.status In ('active','inactive')"
  const expected: Condition = {
    operator: 'In',
    property: 'status',
    value: ['active', 'inactive'],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with NotIn operator', () => {
  const input = "$.status Not In ('pending','failed')"
  const expected: Condition = {
    operator: 'NotIn',
    property: 'status',
    value: ['pending', 'failed'],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with Not wrapper operator', () => {
  const input = "Not ($.status In ('pending','failed'))"
  const expected: Condition = {
    operator: 'Not',
    conditions: [
      {
        property: 'status',
        operator: 'In',
        value: ['pending', 'failed'],
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with Between operator', () => {
  // Here we assume that the literal value is provided as a quoted string.
  const input = '$.score Between 50 AND 100'
  const expected: Condition = {
    operator: 'Between',
    property: 'score',
    value: [50, 100], // Alternatively, if your parser converts this to [50, 100], adjust accordingly.
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

// Logical Operator: NOT

test('parse NOT condition', () => {
  const input = 'NOT ($.status == "active")'
  const expected: Condition = {
    operator: 'Not',
    conditions: [
      {
        operator: 'EqualTo',
        property: 'status',
        value: 'active',
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

// Value State Operators
test('parse condition with IsTrue operator', () => {
  const input = '$.flag == true'
  const expected: Condition = {
    operator: 'IsTrue',
    property: 'flag',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsFalse operator', () => {
  const input = '$.flag == false'
  const expected: Condition = {
    operator: 'IsFalse',
    property: 'flag',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsEmpty operator', () => {
  const input = 'IsEmpty($.list)'
  const expected: Condition = {
    operator: 'IsEmpty',
    property: 'list',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with NOT IsEmpty operator', () => {
  const input = 'Not IsEmpty($.list)'
  const expected: Condition = {
    operator: 'Not',
    conditions: [
      {
        operator: 'IsEmpty',
        property: 'list',
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with NOT IsEmpty operator', () => {
  const input = '! IsEmpty($.list)'
  const expected: Condition = {
    operator: 'IsNotEmpty',
    property: 'list',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsNotEmpty operator', () => {
  const input = '!IsEmpty($.list)'
  const expected: Condition = {
    operator: 'IsNotEmpty',
    property: 'list',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsNull operator', () => {
  const input = 'IsNull($.value)'
  const expected: Condition = {
    operator: 'IsNull',
    property: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsDefined operator', () => {
  const input = 'IsDefined($.value)'
  const expected: Condition = {
    operator: 'IsDefined',
    property: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})
test('parse condition with IsDefined operator', () => {
  const input = 'IsString($.value)'
  const expected: Condition = {
    operator: 'IsString',
    property: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with NotNull operator', () => {
  const input = 'IsNull($.value)'
  const expected: Condition = {
    operator: 'IsNull',
    property: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsUndefined operator', () => {
  const input = 'IsUndefined($.value)'
  const expected: Condition = {
    operator: 'IsUndefined',
    property: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with IsDefined operator', () => {
  const input = 'IsDefined($.value)'
  const expected: Condition = {
    operator: 'IsDefined',
    property: 'value',
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})

// Quantifier Operators

test('parse condition with Any quantifier', () => {
  const input = '$.items Any ($.id == 123 OR $.id == 456)'
  const expected: Condition = {
    operator: 'Any',
    property: 'items',
    conditions: [
      {
        operator: 'Or',
        conditions: [
          {
            operator: 'EqualTo',
            property: 'id',
            value: 123,
          },
          {
            operator: 'EqualTo',
            property: 'id',
            value: 456,
          },
        ],
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})
test('parse condition with Any quantifier and operator', () => {
  const input = '$.items Any ($.id == 123 OR $.id == 456) OR $.name == "John"'
  const expected: Condition = or(
    {
      operator: 'Any',
      property: 'items',
      conditions: [
        {
          operator: 'Or',
          conditions: [
            {
              operator: 'EqualTo',
              property: 'id',
              value: 123,
            },
            {
              operator: 'EqualTo',
              property: 'id',
              value: 456,
            },
          ],
        },
      ],
    },
    {
      operator: 'EqualTo',
      property: 'name',
      value: 'John',
    },
  )
  const result = parse(input)
  expect(result).toEqual(expected)
})

test('parse condition with All quantifier', () => {
  const input = '$.items All ($.id == 456)'
  const expected: Condition = {
    operator: 'All',
    property: 'items',
    conditions: [
      {
        operator: 'EqualTo',
        property: 'id',
        value: 456,
      },
    ],
  }
  const result = parse(input)
  expect(result).toEqual(expected)
})
