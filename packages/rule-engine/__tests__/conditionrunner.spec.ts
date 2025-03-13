import { test, expect } from 'vitest'
import { ConditionRunner, ConditionRunnerDefinition, and, or, not } from '../ConditionRunner'
import type { Condition, Modifier, ConditionHandler, HandlerArgs, TokenDefinition } from '../types'
import { modifiers } from '../utils'

// Sample handlers and modifiers for testing
const sampleHandlers: TokenDefinition[] = [
  {
    name: 'EqualTo',
    handler: ({ value, property }: HandlerArgs) => value === property,
  },
  {
    name: 'GreaterThan',
    handler: ({ value, property }: HandlerArgs) => !!(value && property > value),
  },
]

// Create a ConditionRunnerDefinition with sample handlers and modifiers
const definition = new ConditionRunnerDefinition(sampleHandlers, modifiers, true)
const runner = new ConditionRunner(definition)

test.only('and function', () => {
  const condition = and({ operator: 'EqualTo', property: 'foo', value: 'foo' }, { operator: 'EqualTo', property: 'bar', value: 'bar' })
  expect(condition.operator).toBe('And')
  expect(condition.conditions).toHaveLength(2)
})

test('or function', () => {
  const condition = or({ operator: 'EqualTo', property: 'foo', value: 'foo' }, { operator: 'EqualTo', property: 'bar', value: 'bar' })
  expect(condition.operator).toBe('Or')
  expect(condition.conditions).toHaveLength(2)
})

test('not function', () => {
  const condition = not({ operator: 'EqualTo', property: 'foo', value: 'foo' })
  expect(condition.operator).toBe('Not')
  expect(condition.conditions).toHaveLength(1)
})

test('filter method', () => {
  const source = [
    { foo: 'foo', bar: 'bar' },
    { foo: 'foo', bar: 'baz' },
  ]
  const condition: Condition = { operator: 'EqualTo', property: 'bar', value: 'bar' }
  const result = runner.filter(source, condition)
  expect(result).toHaveLength(1)
  expect(result[0].bar).toBe('bar')
})

test('evaluate method', () => {
  const item = { foo: 'foo', bar: 'bar' }
  const condition: Condition = { operator: 'EqualTo', property: 'bar', value: 'bar' }
  const result = runner.evaluate(item, condition)
  expect(result).toHaveLength(1)
  expect(result[0].result).toBe(true)
})

test('test method with EqualTo condition', () => {
  const item = { foo: 'foo', bar: 'bar' }
  const condition: Condition = { operator: 'EqualTo', property: 'bar', value: 'bar' }
  const result = runner.test(item, condition)
  expect(result).toBe(true)
})

test('test method with GreaterThan condition', () => {
  const item = { foo: 'foo', bar: 10 }
  const condition: Condition = { operator: 'GreaterThan', property: 'bar', value: 5 }
  const result = runner.test(item, condition)
  expect(result).toBe(true)
})

test('test method with modifier', () => {
  const item = { foo: 'foo', bar: 'barz' }
  const condition: Condition = { operator: 'EqualTo', property: 'foo.toUpperCase()', value: 'FOO' }
  const result = runner.test(item, condition)
  expect(result).toBe(true)
})
